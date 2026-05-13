import { describe, it, expect } from 'vitest';
import { getLocalizedContent, getLocalizedField } from './fallback';
import type { Locale } from './types';

describe('getLocalizedContent', () => {
  const locales: Locale[] = ['vi', 'en', 'ja'];

  describe('returns the value for the active locale when present', () => {
    it('returns Vietnamese value for vi locale', () => {
      const content = { vi: 'Xin chào', en: 'Hello', ja: 'こんにちは' };
      expect(getLocalizedContent(content, 'vi')).toBe('Xin chào');
    });

    it('returns English value for en locale', () => {
      const content = { vi: 'Xin chào', en: 'Hello', ja: 'こんにちは' };
      expect(getLocalizedContent(content, 'en')).toBe('Hello');
    });

    it('returns Japanese value for ja locale', () => {
      const content = { vi: 'Xin chào', en: 'Hello', ja: 'こんにちは' };
      expect(getLocalizedContent(content, 'ja')).toBe('こんにちは');
    });
  });

  describe('falls back to Vietnamese when active locale value is missing', () => {
    it('falls back to vi when en value is null', () => {
      const content = { vi: 'Xin chào', en: null, ja: 'こんにちは' };
      expect(getLocalizedContent(content, 'en')).toBe('Xin chào');
    });

    it('falls back to vi when ja value is undefined', () => {
      const content = { vi: 'Xin chào', en: 'Hello', ja: undefined };
      expect(getLocalizedContent(content, 'ja')).toBe('Xin chào');
    });

    it('falls back to vi when en value is empty string', () => {
      const content = { vi: 'Xin chào', en: '', ja: 'こんにちは' };
      expect(getLocalizedContent(content, 'en')).toBe('Xin chào');
    });

    it('falls back to vi when locale key is missing entirely', () => {
      const content = { vi: 'Xin chào' };
      expect(getLocalizedContent(content, 'en')).toBe('Xin chào');
      expect(getLocalizedContent(content, 'ja')).toBe('Xin chào');
    });
  });

  describe('returns empty string when both active locale and vi are missing', () => {
    it('returns empty string when both en and vi are null', () => {
      const content = { vi: null, en: null, ja: 'こんにちは' };
      expect(getLocalizedContent(content, 'en')).toBe('');
    });

    it('returns empty string when both ja and vi are undefined', () => {
      const content = { vi: undefined, en: 'Hello', ja: undefined };
      expect(getLocalizedContent(content, 'ja')).toBe('');
    });

    it('returns empty string when both en and vi are empty strings', () => {
      const content = { vi: '', en: '', ja: 'こんにちは' };
      expect(getLocalizedContent(content, 'en')).toBe('');
    });

    it('returns empty string for completely empty content object', () => {
      const content = {};
      for (const locale of locales) {
        expect(getLocalizedContent(content, locale)).toBe('');
      }
    });
  });

  describe('handles edge cases gracefully (never throws)', () => {
    it('handles null content object', () => {
      expect(getLocalizedContent(null as any, 'vi')).toBe('');
    });

    it('handles undefined content object', () => {
      expect(getLocalizedContent(undefined as any, 'en')).toBe('');
    });

    it('handles content with all null values', () => {
      const content = { vi: null, en: null, ja: null };
      for (const locale of locales) {
        expect(getLocalizedContent(content, locale)).toBe('');
      }
    });

    it('handles content with all undefined values', () => {
      const content = { vi: undefined, en: undefined, ja: undefined };
      for (const locale of locales) {
        expect(getLocalizedContent(content, locale)).toBe('');
      }
    });
  });
});

describe('getLocalizedField', () => {
  describe('returns the field value for the active locale', () => {
    it('returns nameEn for en locale', () => {
      const obj = { nameVi: 'Đà Nẵng', nameEn: 'Da Nang', nameJa: 'ダナン' };
      expect(getLocalizedField(obj, 'name', 'en')).toBe('Da Nang');
    });

    it('returns nameVi for vi locale', () => {
      const obj = { nameVi: 'Đà Nẵng', nameEn: 'Da Nang', nameJa: 'ダナン' };
      expect(getLocalizedField(obj, 'name', 'vi')).toBe('Đà Nẵng');
    });

    it('returns nameJa for ja locale', () => {
      const obj = { nameVi: 'Đà Nẵng', nameEn: 'Da Nang', nameJa: 'ダナン' };
      expect(getLocalizedField(obj, 'name', 'ja')).toBe('ダナン');
    });

    it('works with different field prefixes', () => {
      const obj = {
        titleVi: 'Tiêu đề',
        titleEn: 'Title',
        titleJa: 'タイトル',
        descriptionVi: 'Mô tả',
        descriptionEn: 'Description',
        descriptionJa: '説明',
      };
      expect(getLocalizedField(obj, 'title', 'en')).toBe('Title');
      expect(getLocalizedField(obj, 'description', 'ja')).toBe('説明');
    });
  });

  describe('falls back to Vietnamese field when active locale field is missing', () => {
    it('falls back to nameVi when nameEn is missing', () => {
      const obj = { nameVi: 'Đà Nẵng', nameJa: 'ダナン' };
      expect(getLocalizedField(obj, 'name', 'en')).toBe('Đà Nẵng');
    });

    it('falls back to nameVi when nameJa is empty string', () => {
      const obj = { nameVi: 'Đà Nẵng', nameEn: 'Da Nang', nameJa: '' };
      expect(getLocalizedField(obj, 'name', 'ja')).toBe('Đà Nẵng');
    });

    it('falls back to nameVi when nameEn is null', () => {
      const obj = { nameVi: 'Đà Nẵng', nameEn: null, nameJa: 'ダナン' };
      expect(getLocalizedField(obj, 'name', 'en')).toBe('Đà Nẵng');
    });

    it('falls back to nameVi when nameJa is undefined', () => {
      const obj = { nameVi: 'Đà Nẵng', nameEn: 'Da Nang', nameJa: undefined };
      expect(getLocalizedField(obj, 'name', 'ja')).toBe('Đà Nẵng');
    });
  });

  describe('returns empty string when both active locale and vi fields are missing', () => {
    it('returns empty string when both nameEn and nameVi are missing', () => {
      const obj = { nameJa: 'ダナン' };
      expect(getLocalizedField(obj, 'name', 'en')).toBe('');
    });

    it('returns empty string when nameVi is empty and nameEn is missing', () => {
      const obj = { nameVi: '', nameJa: 'ダナン' };
      expect(getLocalizedField(obj, 'name', 'en')).toBe('');
    });

    it('returns empty string when field prefix does not match any field', () => {
      const obj = { nameVi: 'Đà Nẵng', nameEn: 'Da Nang' };
      expect(getLocalizedField(obj, 'title', 'en')).toBe('');
    });
  });

  describe('handles edge cases gracefully (never throws)', () => {
    it('handles null object', () => {
      expect(getLocalizedField(null, 'name', 'vi')).toBe('');
    });

    it('handles undefined object', () => {
      expect(getLocalizedField(undefined, 'name', 'en')).toBe('');
    });

    it('handles empty object', () => {
      expect(getLocalizedField({}, 'name', 'ja')).toBe('');
    });

    it('handles empty field prefix', () => {
      const obj = { nameVi: 'Đà Nẵng' };
      expect(getLocalizedField(obj, '', 'vi')).toBe('');
    });

    it('handles null field prefix', () => {
      const obj = { nameVi: 'Đà Nẵng' };
      expect(getLocalizedField(obj, null as any, 'vi')).toBe('');
    });

    it('handles non-string field values gracefully', () => {
      const obj = { nameVi: 123, nameEn: true, nameJa: {} };
      expect(getLocalizedField(obj, 'name', 'en')).toBe('');
      expect(getLocalizedField(obj, 'name', 'ja')).toBe('');
      expect(getLocalizedField(obj, 'name', 'vi')).toBe('');
    });
  });
});
