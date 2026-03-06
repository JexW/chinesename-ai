import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = Math.random().toString(36).slice(2, 10);
    const { error } = await supabase.from("saved_names").insert([{ id, ...body }]);
    if (error) throw error;
    return NextResponse.json({ id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
