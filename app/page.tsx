"use client";
import { useState } from "react";

const translations = {
  en: {
    tagline: "Bridging cultures through the art of Chinese naming",
    firstName: "First Name", lastName: "Last Name", birthPlace: "Birth City & Country",
    birthDate: "Birth Date", birthTime: "Birth Time (local time)",
    birthTimeTip: "We'll automatically convert to Beijing Time for accurate BaZi calculation",
    generate: "Generate My Chinese Name", generating: "Consulting the stars...",
    switchLang: "中文",
    phoneticTitle: "Phonetic Reference", phoneticDesc: "Direct sound-based translation (no meaning consideration)",
    baziTitle: "Your BaZi Chart", year: "Year", month: "Month", day: "Day", hour: "Hour",
    meaningTitle: "Name Analysis", shareBtn: "Share My Name", newName: "Generate Again",
    chooseTitle: "Choose Your Name",
    placeholderFirst: "e.g. James", placeholderLast: "e.g. Smith", placeholderCity: "e.g. London, UK",
  },
  zh: {
    tagline: "以中文命名艺术，连接东西方文化",
    firstName: "名字", lastName: "姓氏", birthPlace: "出生城市与国家",
    birthDate: "出生日期", birthTime: "出生时间（当地时间）",
    birthTimeTip: "我们将自动换算为北京时间，以准确计算八字",
    generate: "生成我的中文名", generating: "正在问卜星象...",
    switchLang: "English",
    phoneticTitle: "音译参考", phoneticDesc: "仅根据发音直译（不考虑含义）",
    baziTitle: "你的八字命盘", year: "年柱", month: "月柱", day: "日柱", hour: "时柱",
    meaningTitle: "名字解析", shareBtn: "分享我的名字", newName: "重新生成",
    chooseTitle: "选择你的名字",
    placeholderFirst: "例如 James", placeholderLast: "例如 Smith", placeholderCity: "例如 London, UK",
  },
};

const HEAVENLY_STEMS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const EARTHLY_BRANCHES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const STEM_ELEMENTS = ["Wood","Wood","Fire","Fire","Earth","Earth","Metal","Metal","Water","Water"];

function getBaziPillar(s: number, b: number): string {
  return HEAVENLY_STEMS[s] + EARTHLY_BRANCHES[b];
}

function calculateBazi(dateStr: string, timeStr: string) {
  const parts = dateStr.split("-").map(Number);
  const year = parts[0], month = parts[1];
  const hour = timeStr.split(":").map(Number)[0];
  const yearStem = (year - 4) % 10, yearBranch = (year - 4) % 12;
  const solarMonth = month - 1;
  const monthStem = (yearStem * 2 + solarMonth) % 10, monthBranch = (solarMonth + 2) % 12;
  const dayCycle = Math.floor((new Date(dateStr).getTime() - new Date("1900-01-01").getTime()) / 86400000);
  const dayStem = (dayCycle + 10) % 10, dayBranch = (dayCycle + 12) % 12;
  const hourBranch = Math.floor((hour + 1) / 2) % 12, hourStem = (dayStem * 2 + hourBranch) % 10;
  return {
    year: { pillar: getBaziPillar(yearStem, yearBranch), element: STEM_ELEMENTS[yearStem] },
    month: { pillar: getBaziPillar(monthStem, monthBranch), element: STEM_ELEMENTS[monthStem] },
    day: { pillar: getBaziPillar(dayStem, dayBranch), element: STEM_ELEMENTS[dayStem] },
    hour: { pillar: getBaziPillar(hourStem, hourBranch), element: STEM_ELEMENTS[hourStem] },
  };
}

type ElementKey = "Wood"|"Fire"|"Earth"|"Metal"|"Water";
const elColors: Record<ElementKey, {bg:string;border:string;text:string;badge:string}> = {
  Wood: {bg:"bg-green-50",border:"border-green-200",text:"text-green-700",badge:"bg-green-400"},
  Fire: {bg:"bg-red-50",border:"border-red-200",text:"text-red-700",badge:"bg-red-400"},
  Earth: {bg:"bg-yellow-50",border:"border-yellow-200",text:"text-yellow-700",badge:"bg-yellow-400"},
  Metal: {bg:"bg-gray-50",border:"border-gray-300",text:"text-gray-600",badge:"bg-gray-400"},
  Water: {bg:"bg-blue-50",border:"border-blue-200",text:"text-blue-700",badge:"bg-blue-400"},
};
function getElColor(element: string) { return elColors[element as ElementKey] || elColors.Wood; }

function BaziCard({label,data}:{label:string;data:{pillar:string;element:string}}) {
  const c = getElColor(data.element);
  return (
    <div className={`rounded-2xl border-2 ${c.border} ${c.bg} p-3 flex flex-col items-center gap-1`}>
      <span className={`text-xs font-semibold uppercase tracking-wider ${c.text} opacity-70`}>{label}</span>
      <span className="text-4xl font-bold text-gray-800" style={{fontFamily:"serif"}}>{data.pillar}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge} text-white font-medium`}>{data.element}</span>
    </div>
  );
}

function Dots() {
  return <span className="inline-flex gap-1">{[0,1,2].map(i=><span key={i} className="w-2 h-2 bg-amber-300 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}</span>;
}

interface CharData {char:string;pinyin:string;meaning:string;strokes:number;element:string}
interface BaziData {pillar:string;element:string}
interface NameOption {
  chineseName:string;pinyin:string;style:string;styleZh:string;
  characters:CharData[];nameMeaning:string;baziMatch:string;
}
interface ResultData {
  names:NameOption[];phoneticOnly:string;phoneticPinyin:string;
  baziAnalysis:string;luckyElement:string;
  bazi:{year:BaziData;month:BaziData;day:BaziData;hour:BaziData};
  form:{firstName:string;lastName:string};
}

export default function App() {
  const [lang, setLang] = useState<"en"|"zh">("en");
  const t = translations[lang];
  const [form, setForm] = useState({firstName:"",lastName:"",birthPlace:"",birthDate:"",birthTime:""});
  const [result, setResult] = useState<ResultData|null>(null);
  const [selectedName, setSelectedName] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f=>({...f,[e.target.name]:e.target.value}));

  const handleSubmit = async () => {
    if (!form.firstName||!form.birthDate||!form.birthTime||!form.birthPlace) {
      setError(lang==="en"?"Please fill in all required fields.":"请填写所有必填项。"); return;
    }
    setError(""); setLoading(true); setResult(null);
    const bazi = calculateBazi(form.birthDate, form.birthTime);

    const prompt = `You are a master Chinese name consultant with deep expertise in:
- BaZi (八字) Five Elements analysis
- Chinese phonetics and classical poetry
- Cross-language phonetic matching (English, French, Spanish, German, Italian, etc.)
- Traditional Chinese surnames (百家姓)

IMPORTANT: Respond in ${lang === "zh" ? "Chinese (中文)" : "English"} for all explanations, meanings, and analysis. Only the JSON keys should remain in English.

A foreign person wants a BEAUTIFUL, AUTHENTIC Chinese name. NOT a phonetic transliteration.

Person details:
- Full name: ${form.firstName} ${form.lastName}
- Native language / Birth place: ${form.birthPlace}
- Birth date: ${form.birthDate}, Birth time: ${form.birthTime}
- BaZi: Year ${bazi.year.pillar}(${bazi.year.element}), Month ${bazi.month.pillar}(${bazi.month.element}), Day ${bazi.day.pillar}(${bazi.day.element}), Hour ${bazi.hour.pillar}(${bazi.hour.element})

STRICT RULES:
1. Surname MUST be a real Chinese surname from 百家姓 (e.g. 李,王,张,刘,陈,杨,赵,吴,周,徐,林,黄,孙,马,朱,胡,郭,何,高,罗)
2. The name should SOUND like their original name - match phonetics of their native language pronunciation
3. Characters must strengthen weak BaZi elements
4. Name must have beautiful meaning and feel like a real Chinese person's name
5. Generate exactly 3 name options with different styles

Styles:
- Option 1: Classical/elegant (古典风)
- Option 2: Modern/energetic (现代风)
- Option 3: Nature/poetic (自然风)

Also provide a pure phonetic transliteration as reference.

Respond ONLY with valid JSON, no markdown:
{"names":[{"chineseName":"李明阳","pinyin":"Lǐ Míng Yáng","style":"Classical","styleZh":"古典风","characters":[{"char":"李","pinyin":"Lǐ","meaning":"plum tree","strokes":7,"element":"Wood"}],"nameMeaning":"${lang === "zh" ? "用中文解释名字含义" : "explanation in English"}","baziMatch":"${lang === "zh" ? "用中文解释八字分析" : "bazi analysis in English"}"}],"phoneticOnly":"哈利波特","phoneticPinyin":"Hā Lì Bō Tè","baziAnalysis":"brief analysis","luckyElement":"Fire"}`;

    try {
      const res = await fetch("/api/generate", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({prompt})
      });
      const data = await res.json();
      const text = data.content?.map((b:{type:string;text?:string})=>b.text||"").join("")||"";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      setResult({...parsed, bazi, form});
      setSelectedName(0);
    } catch(err) {
      setError(lang==="en"?"Something went wrong. Please try again.":"出现错误，请重试。");
      console.error(err);
    }
    setLoading(false);
  };

  const handleShare = () => {
    if (!result?.names?.[selectedName]) return;
    const n = result.names[selectedName];
    navigator.clipboard.writeText(lang==="en"
      ? `My Chinese name is ${n.chineseName} (${n.pinyin})! Get yours at ChineseName.ai`
      : `我的中文名是${n.chineseName}（${n.pinyin}）！`);
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-red-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-amber-100 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏮</span>
          <span className="font-bold text-gray-800 text-lg">ChineseName<span className="text-red-500">.ai</span></span>
        </div>
        <button onClick={()=>setLang(l=>l==="en"?"zh":"en")} className="text-sm px-4 py-1.5 rounded-full border border-amber-300 text-amber-700 hover:bg-amber-50 transition font-medium">{t.switchLang}</button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1 text-red-600 text-sm font-medium mb-4">✨ {t.tagline}</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            {lang==="en"?<>Find Your <span className="text-red-500">Chinese Name</span></>:<>发现你的<span className="text-red-500">中文名</span></>}
          </h1>
        </div>

        {!result ? (
          <div className="bg-white rounded-3xl shadow-lg shadow-amber-100 border border-amber-100 p-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t.firstName} *</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} placeholder={t.placeholderFirst} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t.lastName}</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder={t.placeholderLast} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"/>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t.birthPlace} *</label>
              <input name="birthPlace" value={form.birthPlace} onChange={handleChange} placeholder={t.placeholderCity} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"/>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t.birthDate} *</label>
                <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t.birthTime} *</label>
                <input type="time" name="birthTime" value={form.birthTime} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"/>
              </div>
            </div>
            <p className="text-xs text-amber-600 mb-6">⏰ {t.birthTimeTip}</p>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition shadow-md shadow-amber-200 flex items-center justify-center gap-2">
              {loading?<><Dots/><span>{t.generating}</span></>:<><span>🏮</span>{t.generate}</>}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Name selector */}
            <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-4">
              <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-widest">{t.chooseTitle}</p>
              <div className="grid grid-cols-3 gap-2">
                {result.names?.map((n, i) => (
                  <button key={i} onClick={()=>setSelectedName(i)}
                    className={`rounded-2xl p-3 text-center transition border-2 ${selectedName===i?"border-red-400 bg-red-50":"border-gray-100 hover:border-amber-200"}`}>
                    <div className="text-2xl font-black text-gray-800 mb-1" style={{fontFamily:"serif"}}>{n.chineseName}</div>
                    <div className="text-xs text-gray-500">{n.styleZh}</div>
                  </button>
                ))}
              </div>
            </div>

            {result.names?.[selectedName] && <>
              <div className="bg-gradient-to-br from-red-600 to-amber-500 rounded-3xl p-8 text-white text-center shadow-xl shadow-red-200">
                <p className="text-red-100 text-sm font-medium mb-2 uppercase tracking-widest">{result.names[selectedName].style}</p>
                <div className="text-7xl font-black mb-3 tracking-wider" style={{fontFamily:"serif"}}>{result.names[selectedName].chineseName}</div>
                <p className="text-2xl text-amber-100 font-light tracking-widest">{result.names[selectedName].pinyin}</p>
                {result.luckyElement&&<div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium">⭐ Lucky Element: <strong>{result.luckyElement}</strong></div>}
              </div>

              <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-widest">{t.meaningTitle}</h3>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {result.names[selectedName].characters?.map((c,i)=>{
                    const col=getElColor(c.element);
                    return <div key={i} className={`rounded-2xl border-2 ${col.border} ${col.bg} p-4 text-center`}>
                      <div className="text-4xl font-black text-gray-800 mb-1" style={{fontFamily:"serif"}}>{c.char}</div>
                      <div className={`text-sm font-semibold ${col.text} mb-1`}>{c.pinyin}</div>
                      <div className="text-xs text-gray-500">{c.meaning}</div>
                      <div className="text-xs text-gray-400 mt-1">{c.strokes} strokes</div>
                    </div>;
                  })}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed bg-amber-50 rounded-xl p-4 mb-3">{result.names[selectedName].nameMeaning}</p>
                <p className="text-gray-500 text-xs leading-relaxed bg-stone-50 rounded-xl p-3">{result.names[selectedName].baziMatch}</p>
              </div>
            </>}

            <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-widest">{t.baziTitle}</h3>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <BaziCard label={t.year} data={result.bazi.year}/>
                <BaziCard label={t.month} data={result.bazi.month}/>
                <BaziCard label={t.day} data={result.bazi.day}/>
                <BaziCard label={t.hour} data={result.bazi.hour}/>
              </div>
              {result.baziAnalysis&&<p className="text-gray-500 text-sm leading-relaxed bg-stone-50 rounded-xl p-4">{result.baziAnalysis}</p>}
            </div>

            <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-700 mb-1 text-sm uppercase tracking-widest">{t.phoneticTitle}</h3>
              <p className="text-xs text-gray-400 mb-4">{t.phoneticDesc}</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center">
                  <div className="text-xs text-gray-400 mb-1">Original</div>
                  <div className="text-xl font-bold text-gray-700">{result.form.firstName} {result.form.lastName}</div>
                </div>
                <div className="text-2xl text-amber-400">→</div>
                <div className="flex-1 bg-amber-50 rounded-2xl p-4 text-center">
                  <div className="text-xs text-amber-500 mb-1">音译 Phonetic</div>
                  <div className="text-2xl font-bold text-gray-800" style={{fontFamily:"serif"}}>{result.phoneticOnly}</div>
                  <div className="text-sm text-amber-600">{result.phoneticPinyin}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleShare} className="flex-1 bg-white border-2 border-amber-300 text-amber-700 font-semibold py-3 rounded-2xl hover:bg-amber-50 transition flex items-center justify-center gap-2">
                {copied?"✅ Copied!":"📤 "+t.shareBtn}
              </button>
              <button onClick={()=>{setResult(null);setSelectedName(0);}} className="flex-1 bg-gradient-to-r from-red-500 to-amber-500 text-white font-semibold py-3 rounded-2xl hover:opacity-90 transition flex items-center justify-center gap-2">
                🔄 {t.newName}
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="text-center text-xs text-gray-400 pb-8">🏮 ChineseName.ai · Bridging cultures through the art of Chinese naming</footer>
    </div>
  );
}