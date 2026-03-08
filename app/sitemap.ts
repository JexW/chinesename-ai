// app/sitemap.ts
// 自动生成 sitemap.xml，帮助 Google 索引你的页面

import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.mychinesename.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Dynamic name pages — fetch last 1000 saved names
  try {
    const { data: names } = await supabase
      .from("saved_names")
      .select("id, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);

    const namePages: MetadataRoute.Sitemap = (names || []).map((name) => ({
      url: `${baseUrl}/name/${name.id}`,
      lastModified: new Date(name.created_at),
      changeFrequency: "never" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...namePages];
  } catch {
    return staticPages;
  }
}
