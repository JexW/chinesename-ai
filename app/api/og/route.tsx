// app/api/og/route.tsx
// 动态生成 OG 分享图片
// 每个名字分享出去在微信/Twitter/Facebook 会显示漂亮的预览卡片
//
// 效果：大红色背景，显示中文名 + 拼音 + 英文名
// 访问：/api/og?name=明浩&pinyin=Míng+Hào&english=James+Smith&element=Fire

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chineseName = searchParams.get("name") || "明浩";
  const pinyin = searchParams.get("pinyin") || "Míng Hào";
  const english = searchParams.get("english") || "";
  const element = searchParams.get("element") || "";

  const elementEmoji: Record<string, string> = {
    Wood: "🌿", Fire: "🔥", Earth: "🪨", Metal: "⚙️", Water: "💧",
  };
  const emoji = elementEmoji[element] || "⭐";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 40%, #d97706 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />

        {/* Logo top */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "60px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "36px" }}>🏮</span>
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "24px", fontWeight: "700", fontFamily: "sans-serif" }}>
            ChineseName.ai
          </span>
        </div>

        {/* English name */}
        {english && (
          <div
            style={{
              color: "rgba(255,220,180,0.9)",
              fontSize: "28px",
              marginBottom: "16px",
              fontFamily: "sans-serif",
              fontWeight: "400",
              letterSpacing: "2px",
            }}
          >
            {english}
          </div>
        )}

        {/* Chinese name — HUGE */}
        <div
          style={{
            color: "white",
            fontSize: chineseName.length <= 3 ? "200px" : "160px",
            fontWeight: "900",
            letterSpacing: "20px",
            lineHeight: 1,
            textShadow: "0 4px 40px rgba(0,0,0,0.3)",
          }}
        >
          {chineseName}
        </div>

        {/* Pinyin */}
        <div
          style={{
            color: "rgba(255,235,180,0.95)",
            fontSize: "48px",
            marginTop: "20px",
            letterSpacing: "8px",
            fontFamily: "sans-serif",
            fontWeight: "300",
          }}
        >
          {pinyin}
        </div>

        {/* Lucky element badge */}
        {element && (
          <div
            style={{
              marginTop: "32px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50px",
              padding: "10px 28px",
              color: "white",
              fontSize: "24px",
              fontFamily: "sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>{emoji}</span>
            <span>Lucky Element: {element}</span>
          </div>
        )}

        {/* Bottom CTA */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "60px",
            color: "rgba(255,255,255,0.6)",
            fontSize: "20px",
            fontFamily: "sans-serif",
          }}
        >
          chinesename-ai.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
