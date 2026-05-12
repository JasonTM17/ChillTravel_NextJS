"use client";
import { useLang } from "@/lib/i18n/use-lang";

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "vi" ? "en" : "vi")}
      className="rounded-lg border border-[tv-border] bg-white px-3 py-1.5 text-xs font-bold text-[tv-blue] hover:bg-[tv-blue-light]"
      aria-label="Toggle language"
    >
      {lang === "vi" ? "EN" : "VI"}
    </button>
  );
}
