import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const elColors: Record<string, string> = {
  Wood: "bg-green-50 border-green-200 text-green-700",
  Fire: "bg-red-50 border-red-200 text-red-700",
  Earth: "bg-yellow-50 border-yellow-200 text-yellow-700",
  Metal: "bg-gray-50 border-gray-300 text-gray-600",
  Water: "bg-blue-50 border-blue-200 text-blue-700",
};
export default async function NamePage({ params }: { params: { id: string } }) {
  const { data } = await supabase.from("saved_names").select("*").eq("id", params.id).single();
  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-400">
      <span className="text-4xl">🏮</span>
      <p>Name not found</p>
      <a href="/" className="text-red-500 hover:underline">Generate your own →</a>
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-red-50 py-12 px-4">
      <div className="max-w-lg mx-auto space-y-5">
        <div className="text-center mb-6">
          <a href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl">🏮</span>
            <span className="font-bold text-gray-800 text-lg">ChineseName<span className="text-red-500">.ai</span></span>
          </a>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-amber-500 rounded-3xl p-8 text-white text-center shadow-xl">
          <p className="text-red-100 text-sm mb-2 uppercase tracking-widest">{data.style}</p>
          <div className="text-7xl font-black mb-3 tracking-wider" style={{fontFamily:"serif"}}>{data.chinese_name}</div>
          <p className="text-2xl text-amber-100 font-light tracking-widest">{data.pinyin}</p>
          {data.lucky_element && <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm">⭐ Lucky Element: <strong>{data.lucky_element}</strong></div>}
        </div>
        <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
          <p className="text-xs text-gray-400 mb-1">This is the Chinese name of</p>
          <p className="text-2xl font-bold text-gray-800">{data.first_name} {data.last_name}</p>
        </div>
        {data.characters && (
          <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-widest">Name Analysis</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {(data.characters as {char:string;pinyin:string;meaning:string;strokes:number;element:string}[]).map((c, i) => (
                <div key={i} className={`rounded-2xl border-2 p-4 text-center ${elColors[c.element]||"bg-gray-50 border-gray-200 text-gray-600"}`}>
                  <div className="text-4xl font-black text-gray-800 mb-1" style={{fontFamily:"serif"}}>{c.char}</div>
                  <div className="text-sm font-semibold mb-1">{c.pinyin}</div>
                  <div className="text-xs text-gray-500">{c.meaning}</div>
                  <div className="text-xs text-gray-400 mt-1">{c.strokes} strokes</div>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed bg-amber-50 rounded-xl p-4">{data.name_meaning}</p>
          </div>
        )}
        {data.bazi_analysis && (
          <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-widest">BaZi Analysis</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{data.bazi_analysis}</p>
          </div>
        )}
        <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6 text-center">
          <p className="text-gray-500 text-sm mb-4">Want your own Chinese name?</p>
          <a href="/" className="inline-block bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold px-8 py-3 rounded-2xl hover:opacity-90 transition">
            🏮 Get My Chinese Name
          </a>
        </div>
      </div>
    </div>
  );
}
