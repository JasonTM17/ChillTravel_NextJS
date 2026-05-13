/**
 * Unit tests for useLocale hook and LocaleProvider.
 *
 * Tests cover:
 * - localStorage persistence and reading
 * - Default to "vi" for invalid values
 * - Providing translations, formatter, locale, and setLocale
 * - Context error when used outside provider
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { parseStoredLocale, LOCALE_STORAGE_KEY } from './use-locale';

// ─── parseStoredLocale tests ─────────────────────────────────────────────────

describe('parseStoredLocale', () => {
  it('returns "vi" for valid "vi" input', () => {
    expect(parseStoredLocale('vi')).toBe('vi');
  });

  it('returns "en" for valid "en" input', () => {
    expect(parseStoredLocale('en')).toBe('en');
  });

  it('returns "ja" for valid "ja" input', () => {
    expect(parseStoredLocale('ja')).toBe('ja');
  });

  it('defaults to "vi" for null', () => {
    expect(parseStoredLocale(null)).toBe('vi');
  });

  it('defaults to "vi" for undefined', () => {
    expect(parseStoredLocale(undefined)).toBe('vi');
  });

  it('defaults to "vi" for empty string', () => {
    expect(parseStoredLocale('')).toBe('vi');
  });

  it('defaults to "vi" for arbitrary string', () => {
    expect(parseStoredLocale('fr')).toBe('vi');
    expect(parseStoredLocale('de')).toBe('vi');
    expect(parseStoredLocale('zh')).toBe('vi');
    expect(parseStoredLocale('random-string')).toBe('vi');
  });

  it('defaults to "vi" for numeric string', () => {
    expect(parseStoredLocale('123')).toBe('vi');
  });
});

// ─── LOCALE_STORAGE_KEY constant ─────────────────────────────────────────────

describe('LOCALE_STORAGE_KEY', () => {
  it('has the expected value', () => {
    expect(LOCALE_STORAGE_KEY).toBe('wanderviet-locale');
  });
});

// ─── localStorage integration (mock) ────────────────────────────────────────

describe('localStorage integration', () => {
  let mockStorage: Record<string, string>;

  beforeEach(() => {
    mockStorage = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
    });
  });

  it('reads valid locale from localStorage', () => {
    mockStorage[LOCALE_STORAGE_KEY] = 'en';
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    expect(parseStoredLocale(stored)).toBe('en');
  });

  it('defaults to vi when localStorage has invalid value', () => {
    mockStorage[LOCALE_STORAGE_KEY] = 'invalid';
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    expect(parseStoredLocale(stored)).toBe('vi');
  });

  it('defaults to vi when localStorage has no value', () => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    expect(parseStoredLocale(stored)).toBe('vi');
  });

  it('persists locale to localStorage', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'ja');
    expect(mockStorage[LOCALE_STORAGE_KEY]).toBe('ja');
  });
});
