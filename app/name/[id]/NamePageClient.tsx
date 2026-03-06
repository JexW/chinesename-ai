"use client";
// app/name/[id]/NamePageClient.tsx
// 这是原来 page.tsx 的 UI 部分，拆出来作为 client component
// 新增：更好的 UI、分享按钮、CTA

import { useState } from "react";

const elColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  Wood:  { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  badge: "bg-green-400"  },
  Fire:  { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    badge: "bg-red-400"    },
  Earth: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", badge: "bg-yellow-400" },
  Metal: { bg: "bg-gray-50",   border: "border-gray-300",   text: "text-gray-600",   badge: "bg-gray-400"   },
  Water: { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   badge: "bg-blue-400"   },
};

function getElColor(element: string) {
  return elColors[element] || elColors.Wood;
}

interface SavedName {
  id: string;
  first_name: string;
  last_name: string;
  chinese_name: string;
  pinyin: string;
  style: string;
  characters: { char: string; pinyin: string; meaning: string; strokes: number; element: string }[];
  name_meaning: string;
  bazi_analysis: string;
  lucky_element: string;
  phonetic_only?: string;
  phonetic_pinyin?: string;
  element_advice?: {
    missingElements: string[];
    jewelry: string;
    colors: string;
    direction: string;
    lifestyle: string;
    food: string;
  };
  bazi?: {
    year: { pillar: string; element: string };
    month: { pillar: string; element: string };
    day: { pillar: string; element: string };
    hour: { pillar: string; element: string } | null;
  };
}

function SpeakButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const speak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN"; u.rate = 0.8;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };
  return (
    <button
      onClick={speak}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
        speaking
          ? "bg-red-100 text-red-600 border-2 border-red-300"
          : "bg-white/20 text-white border-2 border-white/30 hover:bg-white/30"
      }`}
    >
      {speaking ? "🔊 Playing..." : "🔈 Listen"}
    </button>
  );
}

export default function NamePageClient({
  initialData,
  error,
}: {
  initialData: SavedName | null;
  error?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share && initialData) {
      try {
        await navigator.share({
          title: `My Chinese name is ${initialData.chinese_name}!`,
          text: `I got a Chinese name from ChineseName.ai — ${initialData.chinese_name} (${initialData.pinyin}). Get yours!`,
          url: window.location.href,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (!initialData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-red-50 flex flex-col items-center justify-center gap-4 text-gray-400 px-4">
        <span className="text-5xl">🏮</span>
        <p className="font-semibold text-gray-500">Name not found</p>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <a
          href="/"
          className="mt-2 bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition"
        >
          Generate your own →
        </a>
      </div>
    );
  }

  const data = initialData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-red-50 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-5">

        {/* Header */}
        <div className="text-center mb-2">
          <a href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl">🏮</span>
            <span className="font-bold text-gray-800 text-lg">
              ChineseName<span className="text-red-500">.ai</span>
            </span>
          </a>
        </div>

        {/* Owner label */}
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm px-5 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-lg">👤</div>
          <div>
            <div className="text-xs text-gray-400">Chinese name of</div>
            <div className="text-lg font-black text-gray-800">
              {data.first_name} {data.last_name}
            </div>
          </div>
        </div>

        {/* Main name card */}
        <div className="bg-gradient-to-br from-red-600 to-amber-500 rounded-3xl p-8 text-white text-center shadow-xl shadow-red-200">
          <p className="text-red-100 text-xs font-semibold mb-2 uppercase tracking-widest">
            {data.style}
          </p>
          <div
            className="text-7xl font-black mb-3 tracking-wider"
            style={{ fontFamily: "serif" }}
          >
            {data.chinese_name}
          </div>
          <p className="text-2xl text-amber-100 font-light tracking-widest mb-4">
            {data.pinyin}
          </p>
          <SpeakButton text={data.chinese_name} />
          {data.lucky_element && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium">
              ⭐ Lucky Element: <strong>{data.lucky_element}</strong>
            </div>
          )}
        </div>

        {/* Character analysis */}
        {data.characters && data.characters.length > 0 && (
          <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-widest">
              Name Analysis
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {data.characters.map((c, i) => {
                const col = getElColor(c.element);
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border-2 ${col.border} ${col.bg} p-4 text-center`}
                  >
                    <div
                      className="text-4xl font-black text-gray-800 mb-1"
                      style={{ fontFamily: "serif" }}
                    >
                      {c.char}
                    </div>
                    <div className={`text-sm font-semibold ${col.text} mb-1`}>{c.pinyin}</div>
                    <div className="text-xs text-gray-500">{c.meaning}</div>
                    <div className="text-xs text-gray-400 mt-1">{c.strokes} strokes</div>
                  </div>
                );
              })}
            </div>
            {data.name_meaning && (
              <p className="text-gray-600 text-sm leading-relaxed bg-amber-50 rounded-xl p-4">
                {data.name_meaning}
              </p>
            )}
          </div>
        )}

        {/* BaZi analysis */}
        {data.bazi_analysis && (
          <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-widest">
              BaZi Analysis
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">{data.bazi_analysis}</p>
          </div>
        )}

        {/* Five elements advice */}
        {data.element_advice && (
          <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-widest">
              Five Elements Advice
            </h3>
            <div className="space-y-3">
              {[
                { icon: "💍", label: "Jewelry", value: data.element_advice.jewelry },
                { icon: "🎨", label: "Lucky Colors", value: data.element_advice.colors },
                { icon: "🧭", label: "Direction", value: data.element_advice.direction },
                { icon: "🌱", label: "Lifestyle", value: data.element_advice.lifestyle },
                { icon: "🍽️", label: "Food", value: data.element_advice.food },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 bg-amber-50 rounded-xl p-3 items-start">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-amber-700 mb-0.5">{item.label}</div>
                    <div className="text-sm text-gray-600">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share + CTA */}
        <div className="flex gap-3">
          <button
            onClick={handleNativeShare}
            className="flex-1 bg-white border-2 border-amber-300 text-amber-700 font-semibold py-3.5 rounded-2xl hover:bg-amber-50 transition flex items-center justify-center gap-2 text-sm"
          >
            {copied ? "✅ Copied!" : "📤 Share"}
          </button>
          <a
            href="/"
            className="flex-1 bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition flex items-center justify-center gap-2 text-sm"
          >
            🏮 Get My Name
          </a>
        </div>

        {/* SEO footer text — helps Google understand the page */}
        <p className="text-center text-xs text-gray-400 pt-2 leading-relaxed">
          Generated with{" "}
          <a href="/" className="text-amber-500 hover:underline">
            ChineseName.ai
          </a>{" "}
          — AI-powered Chinese names for foreigners, based on BaZi astrology.
        </p>
      </div>
    </div>
  );
}
