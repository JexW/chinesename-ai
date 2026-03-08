import { NextRequest, NextResponse } from "next/server";

// 简单的内存存储：IP -> { count, resetAt }
// 注意：Vercel serverless 重启后会清零，但对于限流来说已经够用
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const LIMIT = 5;           // 每个 IP 每天最多生成次数
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 小时

function getRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    // 新的一天，重置
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1 };
  }

  if (entry.count >= LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: LIMIT - entry.count };
}

export async function POST(req: NextRequest) {
  try {
    // 获取真实 IP（Vercel 会在这个 header 里放真实 IP）
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { allowed, remaining } = getRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "You've reached the daily limit of 5 free names. Come back tomorrow! 明天再来吧 🏮",
        },
        {
          status: 429,
          headers: { "X-RateLimit-Remaining": "0" },
        }
      );
    }

    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const text =
      data.content
        ?.map((b: { type: string; text?: string }) => b.text || "")
        .join("") || "";

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json(
        { error: "No JSON in response", raw: text },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(match[0]);

    return NextResponse.json(parsed, {
      headers: { "X-RateLimit-Remaining": String(remaining) },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
