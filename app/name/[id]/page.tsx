// app/name/[id]/page.tsx
// 完整替换你现有的分享页
// 新增：动态 metadata、OG tags、结构化数据

import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import NamePageClient from "./NamePageClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

// ─── Dynamic metadata for each name page ───────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabase
    .from("saved_names")
    .select("first_name, last_name, chinese_name, pinyin, name_meaning, lucky_element")
    .eq("id", id)
    .single();

  if (!data) {
    return {
      title: "Chinese Name | ChineseName.ai",
      description: "Discover a beautiful Chinese name on ChineseName.ai",
    };
  }

  const fullName = `${data.first_name} ${data.last_name}`.trim();
  const title = `${fullName}'s Chinese Name is ${data.chinese_name} (${data.pinyin}) | ChineseName.ai`;
  const description = data.name_meaning
    ? `${fullName} chose ${data.chinese_name} (${data.pinyin}) as their Chinese name. ${data.name_meaning.slice(0, 120)}...`
    : `${fullName}'s Chinese name is ${data.chinese_name} (${data.pinyin}). Generated with BaZi astrology on ChineseName.ai.`;

  // OG image via our dynamic route
  const ogImageUrl = `https://chinesename-ai.vercel.app/api/og?name=${encodeURIComponent(data.chinese_name)}&pinyin=${encodeURIComponent(data.pinyin)}&english=${encodeURIComponent(fullName)}&element=${encodeURIComponent(data.lucky_element || "")}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://chinesename-ai.vercel.app/name/${id}`,
      siteName: "ChineseName.ai",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${fullName}'s Chinese name: ${data.chinese_name}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `https://chinesename-ai.vercel.app/name/${id}`,
    },
  };
}

// ─── Server component: fetch data, pass to client ──────────────────────────
export default async function NamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("saved_names")
    .select("*")
    .eq("id", id)
    .single();

  // Structured data for Google
  const structuredData = data
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: `${data.first_name} ${data.last_name}`,
        alternateName: `${data.chinese_name} (${data.pinyin})`,
        description: data.name_meaning,
        url: `https://chinesename-ai.vercel.app/name/${id}`,
      }
    : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <NamePageClient initialData={data as SavedName | null} error={error?.message} />
    </>
  );
}
