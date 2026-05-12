"use client";
import { useLang } from "@/lib/i18n/use-lang";

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "vi" ? "en" : "vi")}
      className="rounded-lg border border-[#d9ecfb] bg-white px-3 py-1.5 text-xs font-black text-[#0277d4] hover:bg-[#eef7ff]"
      aria-label="Toggle language"
    >
      {lang === "vi" ? "EN" : "VI"}
    </button>
  );
}
