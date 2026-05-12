"use client";
import { useState, useEffect } from "react";
import type { Lang } from "./index";

const LANG_KEY = "wv_lang";

export function useLang() {
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    const stored = localStorage.getItem(LANG_KEY) as Lang | null;
    if (stored === "en" || stored === "vi") {
      setLangState(stored);
    }
  }, []);

  function setLang(newLang: Lang) {
    setLangState(newLang);
    localStorage.setItem(LANG_KEY, newLang);
  }

  return { lang, setLang };
}
