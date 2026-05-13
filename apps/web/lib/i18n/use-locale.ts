'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import React from 'react';
import { createFormatter, type LocaleFormatter } from './formatter';
// ─── Synchronous translation imports ─────────────────────────────────────────
// Import translations synchronously so they're available immediately on mount.
// This ensures UI text renders in the correct language before hydration completes.
import en from './locales/en';
import ja from './locales/ja';
import vi from './locales/vi';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './types';
import type { Locale, TranslationNamespace } from './types';

// ─── Constants ───────────────────────────────────────────────────────────────

const LOCALE_STORAGE_KEY = 'wanderviet-locale';

// ─── Translation Map ─────────────────────────────────────────────────────────

const translationMap: Record<Locale, TranslationNamespace> = { vi, en, ja };

// ─── Interface ───────────────────────────────────────────────────────────────

export interface UseLocaleReturn {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationNamespace;
  fmt: LocaleFormatter;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Validates and returns a locale from a raw string value.
 * Returns DEFAULT_LOCALE ("vi") if the value is not a valid supported locale.
 */
function parseStoredLocale(value: string | null | undefined): Locale {
  if (typeof value === 'string' && SUPPORTED_LOCALES.includes(value as Locale)) {
    return value as Locale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Reads the locale from localStorage safely (handles SSR and errors).
 */
function readLocaleFromStorage(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return parseStoredLocale(stored);
  } catch {
    // localStorage may be unavailable (private browsing, storage quota, etc.)
    return DEFAULT_LOCALE;
  }
}

/**
 * Writes the locale to localStorage safely.
 */
function writeLocaleToStorage(locale: Locale): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const LocaleContext = createContext<UseLocaleReturn | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export interface LocaleProviderProps {
  children: ReactNode;
  /** Optional initial locale override (useful for testing) */
  initialLocale?: Locale;
}

/**
 * LocaleProvider wraps the app to provide locale state, translations,
 * and formatting utilities to all child components via React Context.
 *
 * On mount, it reads the stored locale from localStorage.
 * If the stored value is invalid or missing, it defaults to "vi".
 * Locale changes are persisted to localStorage immediately.
 */
export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);

  // Read locale from localStorage on mount (client-side only)
  useEffect(() => {
    const storedLocale = readLocaleFromStorage();
    setLocaleState(storedLocale);
    setHydrated(true);
  }, []);

  // Persist locale changes to localStorage
  const setLocale = useCallback((newLocale: Locale) => {
    // Validate the locale before setting
    const validLocale = SUPPORTED_LOCALES.includes(newLocale) ? newLocale : DEFAULT_LOCALE;
    setLocaleState(validLocale);
    writeLocaleToStorage(validLocale);
  }, []);

  // Memoize translations and formatter to avoid unnecessary re-renders
  const t = useMemo(() => translationMap[locale], [locale]);
  const fmt = useMemo(() => createFormatter(locale), [locale]);

  const value = useMemo<UseLocaleReturn>(
    () => ({ locale, setLocale, t, fmt }),
    [locale, setLocale, t, fmt],
  );

  // During SSR or before hydration, use default locale to avoid mismatch
  // After hydration, use the stored locale
  const contextValue = useMemo<UseLocaleReturn>(() => {
    if (!hydrated) {
      return {
        locale: initialLocale ?? DEFAULT_LOCALE,
        setLocale,
        t: translationMap[initialLocale ?? DEFAULT_LOCALE],
        fmt: createFormatter(initialLocale ?? DEFAULT_LOCALE),
      };
    }
    return value;
  }, [hydrated, value, setLocale, initialLocale]);

  return React.createElement(LocaleContext.Provider, { value: contextValue }, children);
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * useLocale hook provides access to the current locale, translations,
 * formatter, and a function to change the locale.
 *
 * Must be used within a LocaleProvider.
 *
 * @returns UseLocaleReturn with locale, setLocale, t (translations), fmt (formatter)
 * @throws Error if used outside of LocaleProvider
 */
export function useLocale(): UseLocaleReturn {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error(
      'useLocale must be used within a LocaleProvider. ' +
        'Wrap your app with <LocaleProvider> in the root layout.',
    );
  }
  return context;
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export { LOCALE_STORAGE_KEY, parseStoredLocale };
