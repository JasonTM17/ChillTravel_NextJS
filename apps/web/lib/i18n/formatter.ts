/**
 * Locale Formatter
 *
 * Provides locale-aware formatting for dates, currency, and numbers.
 * Uses Intl.DateTimeFormat and custom formatting logic to match
 * the exact output patterns specified per locale.
 *
 * Formatting rules:
 * - Date: dd/MM/yyyy (vi), MM/dd/yyyy (en), yyyy/MM/dd (ja)
 * - Currency: "1.500.000 ₫" (vi), "₫1,500,000" (en), "1,500,000₫" (ja)
 * - Number: dot separator (vi), comma separator (en, ja)
 */

import type { Locale } from './types';

// ─── Interface ───────────────────────────────────────────────────────────────

export interface LocaleFormatter {
  formatDate(date: Date): string;
  formatCurrency(amount: number): string;
  formatNumber(value: number): string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Pads a number to a specified width with leading zeros.
 */
function pad(value: number, width: number): string {
  return String(value).padStart(width, '0');
}

/**
 * Formats a number with the specified thousand separator.
 * Handles non-negative integers.
 */
function formatWithSeparator(value: number, separator: string): string {
  const intValue = Math.floor(Math.abs(value));
  const str = String(intValue);
  const parts: string[] = [];

  for (let i = str.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    parts.unshift(str.slice(start, i));
  }

  return parts.join(separator);
}

// ─── Formatter Implementations ───────────────────────────────────────────────

function createViFormatter(): LocaleFormatter {
  return {
    formatDate(date: Date): string {
      const day = pad(date.getDate(), 2);
      const month = pad(date.getMonth() + 1, 2);
      const year = pad(date.getFullYear(), 4);
      return `${day}/${month}/${year}`;
    },

    formatCurrency(amount: number): string {
      const formatted = formatWithSeparator(amount, '.');
      return `${formatted} ₫`;
    },

    formatNumber(value: number): string {
      return formatWithSeparator(value, '.');
    },
  };
}

function createEnFormatter(): LocaleFormatter {
  return {
    formatDate(date: Date): string {
      const day = pad(date.getDate(), 2);
      const month = pad(date.getMonth() + 1, 2);
      const year = pad(date.getFullYear(), 4);
      return `${month}/${day}/${year}`;
    },

    formatCurrency(amount: number): string {
      const formatted = formatWithSeparator(amount, ',');
      return `₫${formatted}`;
    },

    formatNumber(value: number): string {
      return formatWithSeparator(value, ',');
    },
  };
}

function createJaFormatter(): LocaleFormatter {
  return {
    formatDate(date: Date): string {
      const day = pad(date.getDate(), 2);
      const month = pad(date.getMonth() + 1, 2);
      const year = pad(date.getFullYear(), 4);
      return `${year}/${month}/${day}`;
    },

    formatCurrency(amount: number): string {
      const formatted = formatWithSeparator(amount, ',');
      return `${formatted}₫`;
    },

    formatNumber(value: number): string {
      return formatWithSeparator(value, ',');
    },
  };
}

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Creates a LocaleFormatter for the given locale.
 *
 * @param locale - The locale to create a formatter for
 * @returns A LocaleFormatter with locale-specific formatting methods
 */
export function createFormatter(locale: Locale): LocaleFormatter {
  switch (locale) {
    case 'vi':
      return createViFormatter();
    case 'en':
      return createEnFormatter();
    case 'ja':
      return createJaFormatter();
    default: {
      // Exhaustive check — TypeScript will error if a locale is unhandled
      const _exhaustive: never = locale;
      throw new Error(`Unsupported locale: ${_exhaustive}`);
    }
  }
}
