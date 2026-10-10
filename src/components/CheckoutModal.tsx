"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle2, Loader2, Copy, ShieldCheck, X } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sidcjddnlkrstjkosfkh.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_8VZe4tfIVmxiemZ9tzjKrA_01d_choI"
);

interface CheckoutProps {
  orderId: string;
  recipientAddress: string;
  amountZec: number;
  memoTag: string;
  onClose: () => void;
}

export default function CheckoutModal({
  orderId,
  recipientAddress,
  amountZec,
  memoTag,
  onClose,
}: CheckoutProps) {
  const [status, setStatus] = useState<string>("pending");
  const [copied, setCopied] = useState(false);

  // ZIP-321 Zcash payment standard URI
  const base64Memo = typeof window !== "undefined" ? btoa(memoTag) : "";
  const zcashUri = `zcash:${recipientAddress}?amount=${amountZec}&memo=${base64Memo}`;

  useEffect(() => {
    // Listen live for payment settlement via Supabase Realtime
    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.new && payload.new.status) {
            setStatus(payload.new.status);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-2 text-amber-400">
          <ShieldCheck className="w-6 h-6" />
          <span className="font-semibold text-sm tracking-wide uppercase">Shielded Payment</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-4">Pay with Zcash</h2>

        {status === "confirmed" ? (
          <div className="py-8 flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">Payment Confirmed!</h3>
            <p className="text-slate-400 text-sm mt-1">Settlement confirmed on the shielded pool.</p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* ZIP-321 QR Code */}
            <div className="bg-white p-4 rounded-2xl shadow-inner mb-4">
              <QRCodeSVG value={zcashUri} size={200} level="M" />
            </div>

            <div className="w-full bg-slate-800/80 rounded-xl p-3 text-left text-xs font-mono space-y-1 mb-4 border border-slate-700/50">
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-bold text-amber-400">{amountZec} ZEC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Memo Tag:</span>
                <span className="text-slate-200">{memoTag}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-300 mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Awaiting shielded confirmation on testnet...</span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(recipientAddress);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Address copied!" : "Copy Unified Address"}
            </button>

            {/* Test Simulation trigger for Hackathon judging */}
            <button
              onClick={async () => {
                await fetch("/api/verify-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId, txHash: "test_tx_shielded_zk9482" }),
                });
              }}
              className="mt-4 text-[11px] text-slate-500 underline hover:text-slate-300"
            >
              (Demo trigger: simulate incoming payment)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
