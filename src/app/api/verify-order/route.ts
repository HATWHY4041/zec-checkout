import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { orderId, txHash } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sidcjddnlkrstjkosfkh.supabase.co";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_8VZe4tfIVmxiemZ9tzjKrA_01d_choI";

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("orders")
      .update({ status: "confirmed", tx_hash: txHash })
      .eq("id", orderId)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
