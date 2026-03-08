// app/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-red-950 to-stone-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="mb-12">
          <a href="/" className="text-red-400 text-sm hover:underline">← Back to MyChineseName</a>
          <h1 className="text-4xl font-bold mt-6 mb-3">Privacy Policy</h1>
          <p className="text-white/40 text-sm">Last updated: March 2026</p>
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed">

          {/* Intro */}
          <section>
            <p className="text-lg text-white/80">
              We built MyChineseName.app to be simple, useful, and respectful of your privacy.
              This page explains exactly what data we collect — and what we don't.
            </p>
          </section>

          {/* What we don't collect */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              🔒 What we do <span className="text-red-400">not</span> collect
            </h2>
            <ul className="space-y-3">
              {[
                "Your birth date or birth time — used only to generate your name, never stored",
                "Your real name — used only to find a matching surname, never stored",
                "Your IP address or location",
                "Cookies or tracking pixels",
                "Any account information (no sign-up required)",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* What we do collect */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              📋 What we collect (only when you share)
            </h2>
            <p className="mb-4">
              If you choose to click <strong className="text-white">"Share My Name"</strong>, we store the following in our database so your name can be accessed via a unique link:
            </p>
            <ul className="space-y-3">
              {[
                "Your generated Chinese name, pinyin, and meaning",
                "The Five Elements analysis",
                "The style you chose (Classical, Modern, Nature, Poetic)",
                "A randomly generated ID for your share link",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-white/50 text-sm">
              This data contains no personal information. It cannot be used to identify you.
            </p>
          </section>

          {/* AI */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">🤖 AI Processing</h2>
            <p>
              Your name is generated using the Anthropic Claude API. Your inputs (birth date, birth time, and first name) are sent to Anthropic's servers to generate a response, and are subject to{" "}
              <a
                href="https://www.anthropic.com/legal/privacy"
                target="_blank"
                className="text-red-400 hover:underline"
              >
                Anthropic's Privacy Policy
              </a>
              . We do not store these inputs on our end.
            </p>
          </section>

          {/* Third parties */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">🔗 Third-party services</h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-white/40 mt-0.5">•</span>
                <span><strong className="text-white">Supabase</strong> — stores shared names only</span>
              </li>
              <li className="flex gap-3">
                <span className="text-white/40 mt-0.5">•</span>
                <span><strong className="text-white">Vercel</strong> — hosts the website</span>
              </li>
              <li className="flex gap-3">
                <span className="text-white/40 mt-0.5">•</span>
                <span><strong className="text-white">Anthropic</strong> — AI name generation</span>
              </li>
            </ul>
            <p className="mt-4 text-white/50 text-sm">
              We do not use Google Analytics, Meta Pixel, or any advertising trackers.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">📬 Contact</h2>
            <p>
              Questions about your privacy? Email us at{" "}
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
