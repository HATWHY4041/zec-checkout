"use client";

import { useState } from "react";
import CheckoutModal from "@/components/CheckoutModal";
import { Shield, Lock, Zap } from "lucide-react";

export default function Home() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState("");
  const [currentMemoTag, setCurrentMemoTag] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock merchant address (Zcash Testnet Unified Address format)
  const MERCHANT_ADDRESS =
    "utest1zryu5tmzk20478h3j2f0w5l9a8k2u7v9x6t4s2w1r3e5y7u9o1p3a5s7d9f1g3h5j7k9l";

  const handleBuy = async () => {
    setLoading(true);
    const memoTag = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountZec: 0.15,
          amountUsd: 5.0,
          memoTag,
        }),
      });
      const data = await res.json();
      setCurrentOrderId(data.orderId);
      setCurrentMemoTag(memoTag);
      setShowCheckout(true);
    } catch {
      alert("Failed to initialize order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-mono bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
          ZECATHON Submission
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 text-white">
          ZecCheckout
        </h1>
        <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
          Zero-leak shielded e-commerce checkout. Accept Zcash with real-time settlement while protecting buyer and seller financial data.
        </p>
      </header>

      {/* Demo Store Product Card */}
      <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="h-44 bg-gradient-to-tr from-slate-800 to-slate-700 rounded-2xl flex items-center justify-center mb-6 border border-slate-700/50">
          <Shield className="w-16 h-16 text-amber-400/80" />
        </div>

        <h3 className="text-lg font-bold text-white">Encrypted Cloud Storage Pass</h3>
        <p className="text-xs text-slate-400 mt-1">1-Month private subscription token.</p>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
          <div>
            <div className="text-xl font-extrabold text-white">0.15 ZEC</div>
            <div className="text-xs text-slate-500">~$5.00 USD</div>
          </div>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-400/10"
          >
            {loading ? "Creating..." : "Buy Privately"}
          </button>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid md:grid-cols-3 gap-6 mt-16 text-center">
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
          <Lock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <h4 className="font-semibold text-white text-sm">Orchard Shielded</h4>
          <p className="text-xs text-slate-400 mt-1">No transaction metadata or address balances are revealed on-chain.</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
          <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <h4 className="font-semibold text-white text-sm">Supabase Realtime</h4>
          <p className="text-xs text-slate-400 mt-1">Instant front-end state synchronization the moment a note clears.</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
          <Shield className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <h4 className="font-semibold text-white text-sm">ZIP-321 Standard</h4>
          <p className="text-xs text-slate-400 mt-1">Native QR handshakes compatible with mobile wallets like Zashi & Ywallet.</p>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          orderId={currentOrderId}
          recipientAddress={MERCHANT_ADDRESS}
          amountZec={0.15}
          memoTag={currentMemoTag}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </main>
  );
}
