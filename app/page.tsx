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
    chooseTitle: "Choose Your Name", elementsTitle: "Your Five Elements Advice",
    regenLang: "Language changed — regenerate to see analysis in new language",
    regenSurname: "🔄 New Surname", regenGiven: "🔄 New Given Name",
    regenSurnameLoading: "Finding...", regenGivenLoading: "Finding...",
    unknownTime: "I don't know my birth time",
    unknownTimeNote: "⚠️ Without birth time, the Hour Pillar cannot be calculated. Your name will be based on date + phonetics only.",
    timeSlots: ["Early Morning (子/丑 23:00–03:00)", "Dawn (寅/卯 03:00–07:00)", "Morning (辰/巳 07:00–11:00)", "Noon (午/未 11:00–15:00)", "Afternoon (申/酉 15:00–19:00)", "Evening (戌/亥 19:00–23:00)"],
    placeholderFirst: "e.g. James", placeholderLast: "e.g. Smith", placeholderCity: "e.g. London, UK",
    genderLabel: "Gender",
    genderOptions: [
      { value: "male", label: "♂ Masculine", desc: "Strong, powerful characters" },
      { value: "female", label: "♀ Feminine", desc: "Elegant, graceful characters" },
      { value: "neutral", label: "◎ Neutral", desc: "Balanced, unisex characters" },
    ],
    styleLabel: "Name Style",
    styleOptions: [
      { value: "classical", label: "🏯 Classical", desc: "Tang/Song dynasty inspired" },
      { value: "modern", label: "✨ Modern", desc: "Contemporary & sleek" },
      { value: "nature", label: "🌿 Nature", desc: "Mountains, rivers, flora" },
      { value: "poetic", label: "📜 Poetic", desc: "Literary & philosophical" },
      { value: "surprise", label: "🎲 Surprise me", desc: "Mix of all styles" },
    ],
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
    chooseTitle: "选择你的名字", elementsTitle: "你的五行建议",
    regenLang: "语言已切换 — 重新生成以查看对应语言的分析",
    regenSurname: "🔄 换个姓氏", regenGiven: "🔄 换个名字",
    regenSurnameLoading: "寻找中...", regenGivenLoading: "寻找中...",
    unknownTime: "我不知道出生时间",
    unknownTimeNote: "⚠️ 没有出生时间，无法计算时柱。你的名字将仅根据日期和读音生成。",
    timeSlots: ["深夜早晨（子/丑 23:00–03:00）", "黎明（寅/卯 03:00–07:00）", "上午（辰/巳 07:00–11:00）", "午间（午/未 11:00–15:00）", "下午（申/酉 15:00–19:00）", "傍晚（戌/亥 19:00–23:00）"],
    placeholderFirst: "例如 James", placeholderLast: "例如 Smith", placeholderCity: "例如 London, UK",
    genderLabel: "性别倾向",
    genderOptions: [
      { value: "male", label: "♂ 男性风", desc: "刚健有力的字符" },
      { value: "female", label: "♀ 女性风", desc: "优雅灵秀的字符" },
      { value: "neutral", label: "◎ 中性", desc: "平衡中性的字符" },
    ],
    styleLabel: "名字风格",
    styleOptions: [
      { value: "classical", label: "🏯 古典风", desc: "唐宋诗词意境" },
      { value: "modern", label: "✨ 现代风", desc: "简洁时尚感" },
      { value: "nature", label: "🌿 自然风", desc: "山川草木意象" },
      { value: "poetic", label: "📜 诗意风", desc: "文学哲学气质" },
      { value: "surprise", label: "🎲 随机惊喜", desc: "融合多种风格" },
    ],
  },
};

const TIME_SLOT_HOURS = ["00:30", "04:00", "08:00", "12:00", "16:00", "20:00"];
const HEAVENLY_STEMS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const EARTHLY_BRANCHES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const STEM_ELEMENTS = ["Wood","Wood","Fire","Fire","Earth","Earth","Metal","Metal","Water","Water"];

function getBaziPillar(s: number, b: number): string { return HEAVENLY_STEMS[s] + EARTHLY_BRANCHES[b]; }

function calculateBazi(dateStr: string, timeStr: string | null) {
  const parts = dateStr.split("-").map(Number);
  const year = parts[0], month = parts[1];
  const yearStem = (year - 4) % 10, yearBranch = (year - 4) % 12;
  const solarMonth = month - 1;
  const monthStem = (yearStem * 2 + solarMonth) % 10, monthBranch = (solarMonth + 2) % 12;
  const dayCycle = Math.floor((new Date(dateStr).getTime() - new Date("1900-01-01").getTime()) / 86400000);
  const dayStem = (dayCycle + 10) % 10, dayBranch = (dayCycle + 12) % 12;
  if (!timeStr) {
    return {
      year: { pillar: getBaziPillar(yearStem, yearBranch), element: STEM_ELEMENTS[yearStem] },
      month: { pillar: getBaziPillar(monthStem, monthBranch), element: STEM_ELEMENTS[monthStem] },
      day: { pillar: getBaziPillar(dayStem, dayBranch), element: STEM_ELEMENTS[dayStem] },
      hour: null,
    };
  }
  const hour = timeStr.split(":").map(Number)[0];
  const hourBranch = Math.floor((hour + 1) / 2) % 12, hourStem = (dayStem * 2 + hourBranch) % 10;
  return {
    year: { pillar: getBaziPillar(yearStem, yearBranch), element: STEM_ELEMENTS[yearStem] },
    month: { pillar: getBaziPillar(monthStem, monthBranch), element: STEM_ELEMENTS[monthStem] },
    day: { pillar: getBaziPillar(dayStem, dayBranch), element: STEM_ELEMENTS[dayStem] },
    hour: { pillar: getBaziPillar(hourStem, hourBranch), element: STEM_ELEMENTS[hourStem] },
  };
}

type ElementKey = "Wood"|"Fire"|"Earth"|"Metal"|"Water";
const elColors: Record<ElementKey, {bg:string;border:string;text:string;badge:string;icon:string}> = {
  Wood: {bg:"bg-green-50",border:"border-green-200",text:"text-green-700",badge:"bg-green-400",icon:"🌿"},
  Fire: {bg:"bg-red-50",border:"border-red-200",text:"text-red-700",badge:"bg-red-400",icon:"🔥"},
  Earth: {bg:"bg-yellow-50",border:"border-yellow-200",text:"text-yellow-700",badge:"bg-yellow-400",icon:"🪨"},
  Metal: {bg:"bg-gray-50",border:"border-gray-300",text:"text-gray-600",badge:"bg-gray-400",icon:"⚙️"},
  Water: {bg:"bg-blue-50",border:"border-blue-200",text:"text-blue-700",badge:"bg-blue-400",icon:"💧"},
};
function getElColor(element: string) { return elColors[element as ElementKey] || elColors.Wood; }

function BaziCard({label,data}:{label:string;data:{pillar:string;element:string}|null}) {
  if (!data) return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-3 flex flex-col items-center gap-1 opacity-50">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="text-2xl text-gray-300">?</span>
      <span className="text-xs text-gray-300">Unknown</span>
    </div>
  );
  const c = getElColor(data.element);
  return (
    <div className={`rounded-2xl border-2 ${c.border} ${c.bg} p-3 flex flex-col items-center gap-1`}>
      <span className={`text-xs font-semibold uppercase tracking-wider ${c.text} opacity-70`}>{label}</span>
      <span className="text-4xl font-bold text-gray-800" style={{fontFamily:"serif"}}>{data.pillar}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge} text-white font-medium`}>{data.element}</span>
    </div>
  );
}

function SpeakButton({text}: {text: string}) {
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
    <button onClick={speak} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${speaking?"bg-red-100 text-red-600 border-2 border-red-300":"bg-white/20 text-white border-2 border-white/30 hover:bg-white/30"}`}>
      {speaking?"🔊 Playing...":"🔈 Listen"}
    </button>
  );
}

function Dots() {
  return <span className="inline-flex gap-1">{[0,1,2].map(i=><span key={i} className="w-2 h-2 bg-amber-300 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}</span>;
}

interface CharData {char:string;pinyin:string;meaning:string;strokes:number;element:string}
interface BaziData {pillar:string;element:string}
interface NameOption {chineseName:string;pinyin:string;style:string;styleZh:string;characters:CharData[];nameMeaning:string;baziMatch:string}
interface ElementAdvice {missingElements:string[];jewelry:string;colors:string;direction:string;lifestyle:string;food:string}
interface ResultData {
  names:NameOption[];phoneticOnly:string;phoneticPinyin:string;
  baziAnalysis:string;luckyElement:string;elementAdvice:ElementAdvice;
  bazi:{year:BaziData;month:BaziData;day:BaziData;hour:BaziData|null};
  form:{firstName:string;lastName:string};generatedLang:string;
}

function buildPrompt(
  form: {firstName:string;lastName:string;birthPlace:string;birthDate:string},
  timeStr: string|null,
  bazi: ReturnType<typeof calculateBazi>,
  isZh: boolean,
  gender: string,
  styles: string[]
) {
  const baziStr = `Year ${bazi.year.pillar}(${bazi.year.element}), Month ${bazi.month.pillar}(${bazi.month.element}), Day ${bazi.day.pillar}(${bazi.day.element})${bazi.hour ? `, Hour ${bazi.hour.pillar}(${bazi.hour.element})` : ", Hour: Unknown"}`;
  const noTimeNote = !timeStr ? "\nNOTE: Birth time is unknown. Skip Hour Pillar analysis. Focus name on Year/Month/Day elements and phonetics." : "";

  // Gender instruction
  const genderMap: Record<string, string> = {
    male: "MASCULINE — use strong, powerful characters associated with ambition, strength, wisdom (e.g. 浩, 峰, 轩, 睿, 博)",
    female: "FEMININE — use elegant, graceful characters associated with beauty, gentleness, virtue (e.g. 雪, 雅, 婷, 柔, 莹)",
    neutral: "GENDER-NEUTRAL — use balanced characters that work for any gender (e.g. 明, 晨, 云, 林, 思)",
  };
  const genderInstruction = genderMap[gender] || genderMap.neutral;

  // Style instruction
  const styleMap: Record<string, string> = {
    classical: "Classical (古典风) — inspired by Tang/Song dynasty poetry, classical literature, historical elegance",
    modern: "Modern (现代风) — contemporary, sleek, simple characters used by young Chinese today",
    nature: "Nature (自然风) — imagery of mountains, rivers, seasons, flora and fauna",
    poetic: "Poetic (诗意风) — literary, philosophical, drawn from classical Chinese poetry and philosophy",
    surprise: "Surprise mix — freely combine classical, modern, and nature styles creatively",
  };

  // If user picked specific styles, use those; otherwise use all 3 defaults
  const activeStyles = styles.length > 0 && !styles.includes("surprise")
    ? styles.map(s => styleMap[s] || s)
    : styles.includes("surprise")
    ? [styleMap.surprise]
    : [styleMap.classical, styleMap.modern, styleMap.nature];

  const stylesInstruction = activeStyles.length === 1
    ? `Generate 3 name variations all in this style: ${activeStyles[0]}`
    : `Generate exactly ${activeStyles.length} names, one per style:\n${activeStyles.map((s, i) => `  Option ${i+1}: ${s}`).join("\n")}`;

  return `You are a master Chinese name consultant with deep expertise in BaZi Five Elements, Chinese phonetics, classical poetry, and traditional Chinese surnames (百家姓).

IMPORTANT: Write ALL explanations, meanings, analysis, and advice in ${isZh?"Chinese (中文)":"English"}. Only JSON keys stay in English.${noTimeNote}

Person:
- First name: ${form.firstName}
- Last name: ${form.lastName}
- Birth place: ${form.birthPlace}
- Birth date: ${form.birthDate}${timeStr ? `, Birth time: ${timeStr}` : " (birth time unknown)"}
- BaZi: ${baziStr}

GENDER PREFERENCE: ${genderInstruction}

NAME STYLES: ${stylesInstruction}

NAMING RULES:
1. Chinese = SURNAME first + GIVEN NAME after
2. SURNAME from 百家姓 based on LAST NAME sound: Potter->朴, Smith->史, Johnson->庄, Brown->白, Williams->卫, Jones->庄, Taylor->戴, Wilson->魏, Davies->戴, Evans->叶
3. GIVEN NAME (1-2 chars) based on FIRST NAME sound + matches gender preference above
4. Strengthen weak/missing BaZi elements
5. Beautiful real Chinese name, NOT transliteration

PHONETIC: Keep Western order (First then Last): Harry Potter->哈利·波特

Return ONLY valid JSON, no markdown:
{"names":[{"chineseName":"史明浩","pinyin":"Shǐ Míng Hào","style":"Classical","styleZh":"古典风","characters":[{"char":"史","pinyin":"Shǐ","meaning":"historian","strokes":5,"element":"Metal"}],"nameMeaning":"explanation","baziMatch":"bazi note"}],"phoneticOnly":"哈利·波特","phoneticPinyin":"Hā Lì Bō Tè","baziAnalysis":"analysis","luckyElement":"Fire","elementAdvice":{"missingElements":["Water"],"jewelry":"silver","colors":"blue","direction":"North","lifestyle":"tips","food":"recommendations"}}`;
}

function buildRegenPrompt(type: "surname"|"given", currentName: string, form: {firstName:string;lastName:string;birthPlace:string}, isZh: boolean, gender: string) {
  const lang = isZh ? "Chinese" : "English";
  const genderHint = gender === "male" ? "masculine/strong" : gender === "female" ? "feminine/elegant" : "gender-neutral";
  if (type === "surname") {
    return `Give me 1 alternative Chinese surname from 百家姓 for someone whose last name is "${form.lastName}" from ${form.birthPlace}. The surname should sound similar to "${form.lastName}". Current surname is "${currentName[0]}". Give a DIFFERENT one. Return ONLY JSON: {"surname":"汪","pinyin":"Wāng","meaning":"explanation in ${lang}","strokes":7,"element":"Water"}`;
  } else {
    const givenPart = currentName.slice(1);
    return `Give me 1 alternative Chinese given name (1-2 characters) for someone whose first name is "${form.firstName}". Should sound like "${form.firstName}". Prefer ${genderHint} characters. Current given name is "${givenPart}". Give a DIFFERENT one. Return ONLY JSON: {"given":"明浩","pinyin":"Míng Hào","meaning":"explanation in ${lang}","characters":[{"char":"明","pinyin":"Míng","meaning":"bright","strokes":8,"element":"Fire"}]}`;
  }
}

export default function App() {
  const [lang, setLang] = useState<"en"|"zh">("en");
  const t = translations[lang];
  const [form, setForm] = useState({firstName:"",lastName:"",birthPlace:"",birthDate:"",birthTime:""});
  const [unknownTime, setUnknownTime] = useState(false);
  const [timeSlot, setTimeSlot] = useState<number|null>(null);
  const [gender, setGender] = useState("neutral");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [result, setResult] = useState<ResultData|null>(null);
  const [selectedName, setSelectedName] = useState(0);
  const [loading, setLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState<"surname"|"given"|null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f=>({...f,[e.target.name]:e.target.value}));

  const getEffectiveTime = () => {
    if (unknownTime) return timeSlot !== null ? TIME_SLOT_HOURS[timeSlot] : null;
    return form.birthTime || null;
  };

  const toggleStyle = (value: string) => {
    if (value === "surprise") {
      setSelectedStyles(prev => prev.includes("surprise") ? [] : ["surprise"]);
      return;
    }
    setSelectedStyles(prev => {
      const without = prev.filter(s => s !== "surprise");
      if (without.includes(value)) {
        return without.filter(s => s !== value);
      }
      // Max 3 non-surprise styles
      if (without.length >= 3) return without;
      return [...without, value];
    });
  };

  const handleSubmit = async () => {
    if (!form.firstName||!form.birthDate||!form.birthPlace) {
      setError(lang==="en"?"Please fill in all required fields.":"请填写所有必填项。"); return;
    }
    if (!unknownTime && !form.birthTime) {
      setError(lang==="en"?"Please enter birth time or select 'I don't know'.":"请输入出生时间或选择「不知道」。"); return;
    }
    setError(""); setLoading(true); setResult(null);
    const effectiveTime = getEffectiveTime();
    const bazi = calculateBazi(form.birthDate, effectiveTime);
    const prompt = buildPrompt(form, effectiveTime, bazi, lang==="zh", gender, selectedStyles);
    try {
      const res = await fetch("/api/generate", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({...data, bazi, form, generatedLang:lang});
      setSelectedName(0);
    } catch(err) {
      console.error(err);
      setError(lang==="en"?"Something went wrong. Please try again.":"出现错误，请重试。");
    }
    setLoading(false);
  };

  const handleRegen = async (type: "surname"|"given") => {
    if (!result) return;
    setRegenLoading(type);
    const currentName = result.names[selectedName].chineseName;
    const prompt = buildRegenPrompt(type, currentName, form, lang==="zh", gender);
    try {
      const res = await fetch("/api/generate", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const newNames = result.names.map((n, i) => {
        if (i !== selectedName) return n;
        if (type === "surname") {
          const newSurname = data.surname || n.chineseName[0];
          const newPinyin = (data.pinyin || n.pinyin.split(" ")[0]) + " " + n.pinyin.split(" ").slice(1).join(" ");
          const newChar: CharData = {char: newSurname, pinyin: data.pinyin||"", meaning: data.meaning||"", strokes: data.strokes||0, element: n.characters[0]?.element||"Metal"};
          return {...n, chineseName: newSurname + n.chineseName.slice(1), pinyin: newPinyin, characters: [newChar, ...n.characters.slice(1)]};
        } else {
          const newGiven = data.given || n.chineseName.slice(1);
          const surnameChar = n.characters[0];
          const newPinyin = n.pinyin.split(" ")[0] + " " + (data.pinyin||"");
          return {...n, chineseName: n.chineseName[0] + newGiven, pinyin: newPinyin, characters: [surnameChar, ...(data.characters||n.characters.slice(1))]};
        }
      });
      setResult({...result, names: newNames});
    } catch(err) {
      console.error(err);
    }
    setRegenLoading(null);
  };

  const handleShare = async () => {
    if (!result?.names?.[selectedName]) return;
    const n = result.names[selectedName];
    try {
      const res = await fetch("/api/save-name", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          first_name: result.form.firstName,
          last_name: result.form.lastName,
          chinese_name: n.chineseName,
          pinyin: n.pinyin,
          style: n.style,
          characters: n.characters,
          name_meaning: n.nameMeaning,
          bazi: result.bazi,
          element_advice: result.elementAdvice,
          bazi_analysis: result.baziAnalysis,
          lucky_element: result.luckyElement,
          phonetic_only: result.phoneticOnly,
          phonetic_pinyin: result.phoneticPinyin,
        })
      });
      const data = await res.json();
      if (data.id) {
        const url = `${window.location.origin}/name/${data.id}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(()=>setCopied(false),3000);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const langMismatch = result && result.generatedLang !== lang;

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
            {/* Name fields */}
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

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t.birthDate} *</label>
                <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t.birthTime} {unknownTime?"":"*"}</label>
                <input type="time" name="birthTime" value={form.birthTime} onChange={handleChange} disabled={unknownTime} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition disabled:opacity-40 disabled:bg-gray-50"/>
              </div>
            </div>

            {/* Unknown time toggle */}
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input type="checkbox" checked={unknownTime} onChange={e=>{setUnknownTime(e.target.checked);setTimeSlot(null);}} className="w-4 h-4 accent-amber-500"/>
              <span className="text-sm text-amber-700 font-medium">{t.unknownTime}</span>
            </label>

            {unknownTime && (
              <div className="mb-4">
                <p className="text-xs text-amber-600 mb-2">{t.unknownTimeNote}</p>
                <p className="text-xs text-gray-500 mb-2">{lang==="en"?"Optional: pick an approximate time period:":"可选：选择大概的时间段："}</p>
                <div className="grid grid-cols-2 gap-2">
                  {t.timeSlots.map((slot, i) => (
                    <button key={i} onClick={()=>setTimeSlot(timeSlot===i?null:i)}
                      className={`text-xs px-3 py-2 rounded-xl border transition ${timeSlot===i?"border-amber-400 bg-amber-50 text-amber-700 font-semibold":"border-gray-200 text-gray-500 hover:border-amber-200"}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!unknownTime && <p className="text-xs text-amber-600 mb-5">⏰ {t.birthTimeTip}</p>}

            {/* ── GENDER SELECTOR ── */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-600 mb-2">{t.genderLabel}</label>
              <div className="grid grid-cols-3 gap-2">
                {t.genderOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setGender(opt.value)}
                    className={`rounded-xl border-2 p-3 text-center transition ${
                      gender === opt.value
                        ? "border-red-400 bg-red-50"
                        : "border-gray-100 hover:border-amber-200 bg-white"
                    }`}
                  >
                    <div className={`text-sm font-bold mb-0.5 ${gender === opt.value ? "text-red-600" : "text-gray-700"}`}>
                      {opt.label}
                    </div>
                    <div className="text-xs text-gray-400">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── STYLE SELECTOR ── */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                {t.styleLabel}
                <span className="text-xs text-gray-400 font-normal ml-2">
                  {lang === "en" ? "(optional, pick up to 3)" : "（可选，最多选3个）"}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {t.styleOptions.map(opt => {
                  const isActive = selectedStyles.includes(opt.value);
                  const isSurprise = opt.value === "surprise";
                  const isDisabled = !isActive && !isSurprise && selectedStyles.length >= 3 && !selectedStyles.includes("surprise");
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleStyle(opt.value)}
                      disabled={isDisabled}
                      className={`rounded-xl border-2 p-3 text-left transition ${
                        isActive
                          ? "border-amber-400 bg-amber-50"
                          : isDisabled
                          ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                          : "border-gray-100 hover:border-amber-200 bg-white"
                      }`}
                    >
                      <div className={`text-sm font-bold mb-0.5 ${isActive ? "text-amber-700" : "text-gray-700"}`}>
                        {opt.label}
                      </div>
                      <div className="text-xs text-gray-400">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
              {selectedStyles.length === 0 && (
                <p className="text-xs text-gray-400 mt-1.5">
                  {lang === "en" ? "No styles selected → will generate Classical, Modern & Nature" : "未选择 → 将生成古典、现代、自然三种风格"}
                </p>
              )}
            </div>

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition shadow-md shadow-amber-200 flex items-center justify-center gap-2">
              {loading?<><Dots/><span>{t.generating}</span></>:<><span>🏮</span>{t.generate}</>}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {langMismatch && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 text-amber-700 text-sm text-center">⚠️ {t.regenLang}</div>
            )}

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
              {/* Main name card */}
              <div className="bg-gradient-to-br from-red-600 to-amber-500 rounded-3xl p-8 text-white text-center shadow-xl shadow-red-200">
                <p className="text-red-100 text-sm font-medium mb-2 uppercase tracking-widest">{result.names[selectedName].style}</p>
                <div className="text-7xl font-black mb-3 tracking-wider" style={{fontFamily:"serif"}}>{result.names[selectedName].chineseName}</div>
                <p className="text-2xl text-amber-100 font-light tracking-widest mb-3">{result.names[selectedName].pinyin}</p>
                <SpeakButton text={result.names[selectedName].chineseName}/>
                {result.luckyElement&&<div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium">⭐ Lucky Element: <strong>{result.luckyElement}</strong></div>}

                {/* Regen buttons */}
                <div className="mt-4 flex gap-2 justify-center">
                  <button onClick={()=>handleRegen("surname")} disabled={regenLoading!==null}
                    className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full border border-white/30 transition disabled:opacity-50">
                    {regenLoading==="surname"?t.regenSurnameLoading:t.regenSurname}
                  </button>
                  <button onClick={()=>handleRegen("given")} disabled={regenLoading!==null}
                    className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full border border-white/30 transition disabled:opacity-50">
                    {regenLoading==="given"?t.regenGivenLoading:t.regenGiven}
                  </button>
                </div>
              </div>

              {/* Name analysis */}
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

            {/* BaZi chart */}
            <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-widest">{t.baziTitle}</h3>
              {!result.bazi.hour && <p className="text-xs text-amber-600 mb-3">⚠️ {t.unknownTimeNote}</p>}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <BaziCard label={t.year} data={result.bazi.year}/>
                <BaziCard label={t.month} data={result.bazi.month}/>
                <BaziCard label={t.day} data={result.bazi.day}/>
                <BaziCard label={t.hour} data={result.bazi.hour}/>
              </div>
              {result.baziAnalysis&&<p className="text-gray-500 text-sm leading-relaxed bg-stone-50 rounded-xl p-4">{result.baziAnalysis}</p>}
            </div>

            {/* Five Elements Advice */}
            {result.elementAdvice && (
              <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-widest">{t.elementsTitle}</h3>
                {result.elementAdvice.missingElements?.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {result.elementAdvice.missingElements.map((el,i)=>{
                      const c=getElColor(el);
                      return <span key={i} className={`${c.badge} text-white text-xs px-3 py-1 rounded-full font-medium`}>{c.icon} {el}</span>;
                    })}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {icon:"💍",label:lang==="zh"?"首饰配件":"Jewelry",value:result.elementAdvice.jewelry},
                    {icon:"🎨",label:lang==="zh"?"幸运颜色":"Lucky Colors",value:result.elementAdvice.colors},
                    {icon:"🧭",label:lang==="zh"?"吉利方位":"Lucky Direction",value:result.elementAdvice.direction},
                    {icon:"🌱",label:lang==="zh"?"生活建议":"Lifestyle",value:result.elementAdvice.lifestyle},
                    {icon:"🍽️",label:lang==="zh"?"饮食建议":"Food",value:result.elementAdvice.food},
                  ].map((item,i)=>(
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

            {/* Phonetic reference */}
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

            {/* Buttons */}
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
      <footer className="text-center text-xs text-gray-400 pb-8 space-y-1">
        <div>🏮 ChineseName.ai · Bridging cultures through the art of Chinese naming</div>
        <div>Feedback or questions? <a href="mailto:chinesename.sup@outlook.com" className="text-amber-500 hover:underline">Contact us</a></div>
      </footer>
    </div>
  );
}
