"use client";

import { useState } from "react";

const content = {
  en: {
    back: "← Back to MyChineseName",
    title: "Privacy Policy",
    updated: "Last updated: March 2026",
    intro: "We built MyChineseName.app to be simple, useful, and respectful of your privacy. This page explains exactly what data we collect — and what we don't.",
    notCollect: {
      title: "What we do not collect",
      items: [
        "Your birth date or birth time — used only to generate your name, never stored",
        "Your real name — used only to find a matching surname, never stored",
        "Your IP address or location",
        "Cookies or tracking pixels",
        "Any account information (no sign-up required)",
      ],
    },
    collect: {
      title: "What we collect (only when you share)",
      desc: 'If you choose to click "Share My Name", we store the following in our database so your name can be accessed via a unique link:',
      items: [
        "Your generated Chinese name, pinyin, and meaning",
        "The Five Elements analysis",
        "The style you chose (Classical, Modern, Nature, Poetic)",
        "A randomly generated ID for your share link",
      ],
      note: "This data contains no personal information. It cannot be used to identify you.",
    },
    ai: {
      title: "🤖 AI Processing",
      desc: "Your name is generated using the Anthropic Claude API. Your inputs (birth date, birth time, and first name) are sent to Anthropic's servers to generate a response, and are subject to ",
      link: "Anthropic's Privacy Policy",
      desc2: ". We do not store these inputs on our end.",
    },
    third: {
      title: "🔗 Third-party services",
      items: [
        { name: "Supabase", desc: "stores shared names only" },
        { name: "Vercel", desc: "hosts the website" },
        { name: "Anthropic", desc: "AI name generation" },
      ],
      note: "We do not use Google Analytics, Meta Pixel, or any advertising trackers.",
    },
    contact: {
      title: "📬 Contact",
      desc: "Questions about your privacy? Email us at ",
    },
  },
  zh: {
    back: "← 返回 MyChineseName",
    title: "隐私政策",
    updated: "最后更新：2026年3月",
    intro: "我们创建 MyChineseName.app 的初衷是简单、实用，并尊重您的隐私。本页面将清楚说明我们收集哪些数据——以及我们不收集什么。",
    notCollect: {
      title: "我们不收集的信息",
      items: [
        "您的出生日期和出生时间——仅用于生成名字，从不存储",
        "您的真实姓名——仅用于匹配姓氏，从不存储",
        "您的 IP 地址或位置信息",
        "Cookies 或追踪像素",
        "任何账户信息（无需注册）",
      ],
    },
    collect: {
      title: "我们收集的信息（仅在您分享时）",
      desc: '如果您点击"分享我的名字"，我们会将以下内容存储在数据库中，以便通过唯一链接访问您的名字：',
      items: [
        "您生成的中文名、拼音和含义",
        "五行分析结果",
        "您选择的风格（古典、现代、自然、诗意）",
        "随机生成的分享链接 ID",
      ],
      note: "这些数据不包含任何个人信息，无法用于识别您的身份。",
    },
    ai: {
      title: "🤖 AI 处理",
      desc: "您的名字通过 Anthropic Claude API 生成。您的输入（出生日期、出生时间和名字）会发送至 Anthropic 的服务器以生成结果，适用于 ",
      link: "Anthropic 隐私政策",
      desc2: "。我们不会在自己的服务器上存储这些输入。",
    },
    third: {
      title: "🔗 第三方服务",
      items: [
        { name: "Supabase", desc: "仅存储分享的名字" },
        { name: "Vercel", desc: "网站托管" },
        { name: "Anthropic", desc: "AI 名字生成" },
      ],
      note: "我们不使用 Google Analytics、Meta Pixel 或任何广告追踪器。",
    },
    contact: {
      title: "📬 联系我们",
      desc: "对隐私有疑问？请发送邮件至 chinesename.sup@outlook.com",
    },
  },
};

export default function PrivacyPage() {
  const [lang, setLang] = useState<"en" | "zh">("en");
  const t = content[lang];

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-950 to-stone-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-20">

        <div className="mb-12">
          <div className="flex items-center justify-between">
            <a href="/" className="text-red-400 text-sm hover:underline">{t.back}</a>
            <button
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              className="text-sm border border-red-400/40 text-red-400 px-4 py-1.5 rounded-full hover:bg-red-400/10 transition"
            >
              {lang === "en" ? "中文" : "English"}
            </button>
          </div>
          <h1 className="text-4xl font-bold mt-6 mb-3">{t.title}</h1>
          <p className="text-white/40 text-sm">{t.updated}</p>
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed">

          <section>
            <p className="text-lg text-white/80">{t.intro}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">🔒 {t.notCollect.title}</h2>
            <ul className="space-y-3">
              {t.notCollect.items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">📋 {t.collect.title}</h2>
            <p className="mb-4">{t.collect.desc}</p>
            <ul className="space-y-3">
              {t.collect.items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-white/50 text-sm">{t.collect.note}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">{t.ai.title}</h2>
            <p>
              {t.ai.desc}
              <a href="https://www.anthropic.com/legal/privacy" target="_blank" className="text-red-400 hover:underline">
                {t.ai.link}
              </a>
              {t.ai.desc2}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">{t.third.title}</h2>
            <ul className="space-y-3">
              {t.third.items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-white/40 mt-0.5">•</span>
                  <span><strong className="text-white">{item.name}</strong> — {item.desc}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-white/50 text-sm">{t.third.note}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">{t.contact.title}</h2>
            <p>
              {t.contact.desc}
              <a href="mailto:chinesename.sup@outlook.com" className="text-red-400 hover:underline">
                contact@mychinesename.app
              </a>
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
