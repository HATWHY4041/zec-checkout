import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { amountZec, amountUsd, memoTag } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sidcjddnlkrstjkosfkh.supabase.co";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_8VZe4tfIVmxiemZ9tzjKrA_01d_choI";

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          amount_zec: amountZec,
          amount_usd: amountUsd,
          memo_tag: memoTag,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orderId: data.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
