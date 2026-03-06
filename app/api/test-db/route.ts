import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Missing env vars", url: !!url, key: !!key });
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from("saved_names").select("*").eq("id", "9gewqmrz").single();
  return NextResponse.json({ data, error });
}
