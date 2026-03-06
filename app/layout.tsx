// app/layout.tsx
// 替换你现有的 layout.tsx

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChineseName.ai — Find Your Chinese Name with BaZi",
  description:
    "Get a beautiful, meaningful Chinese name based on your BaZi (Eight Characters) birth chart. AI-powered, culturally authentic. Free for foreigners learning Chinese or living in China.",
  keywords: [
    "Chinese name generator",
    "Chinese name for foreigners",
    "BaZi name",
    "get a Chinese name",
    "Chinese name meaning",
    "八字取名",
    "外国人中文名",
  ],
  authors: [{ name: "ChineseName.ai" }],
  creator: "ChineseName.ai",
  openGraph: {
    title: "ChineseName.ai — Find Your Chinese Name with BaZi",
    description:
      "Get a beautiful, meaningful Chinese name based on your BaZi birth chart. AI-powered, culturally authentic. Free.",
    url: "https://chinesename-ai.vercel.app",
    siteName: "ChineseName.ai",
    images: [
      {
        url: "https://chinesename-ai.vercel.app/og-default.png",
        width: 1200,
        height: 630,
        alt: "ChineseName.ai — Find Your Chinese Name",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChineseName.ai — Find Your Chinese Name with BaZi",
    description:
      "Get a beautiful, meaningful Chinese name based on your BaZi birth chart. AI-powered & free.",
    images: ["https://chinesename-ai.vercel.app/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://chinesename-ai.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Structured data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ChineseName.ai",
              url: "https://chinesename-ai.vercel.app",
              description:
                "AI-powered Chinese name generator for foreigners, based on BaZi (Eight Characters) astrology.",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
