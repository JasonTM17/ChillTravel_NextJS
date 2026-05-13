import { describe, it, expect } from 'vitest';
import { createFormatter } from './formatter';
import type { Locale } from './types';

describe('createFormatter', () => {
  describe('formatDate', () => {
    const date = new Date(2024, 0, 15); // January 15, 2024

    it('formats date as dd/MM/yyyy for vi', () => {
      const fmt = createFormatter('vi');
      expect(fmt.formatDate(date)).toBe('15/01/2024');
    });

    it('formats date as MM/dd/yyyy for en', () => {
      const fmt = createFormatter('en');
      expect(fmt.formatDate(date)).toBe('01/15/2024');
    });

    it('formats date as yyyy/MM/dd for ja', () => {
      const fmt = createFormatter('ja');
      expect(fmt.formatDate(date)).toBe('2024/01/15');
    });

    it('pads single-digit day and month', () => {
      const d = new Date(2024, 2, 5); // March 5, 2024
      expect(createFormatter('vi').formatDate(d)).toBe('05/03/2024');
      expect(createFormatter('en').formatDate(d)).toBe('03/05/2024');
      expect(createFormatter('ja').formatDate(d)).toBe('2024/03/05');
    });
  });

  describe('formatCurrency', () => {
    it('formats with dot separator and ₫ suffix for vi', () => {
      const fmt = createFormatter('vi');
      expect(fmt.formatCurrency(1500000)).toBe('1.500.000 ₫');
    });

    it('formats with comma separator and ₫ prefix for en', () => {
      const fmt = createFormatter('en');
      expect(fmt.formatCurrency(1500000)).toBe('₫1,500,000');
    });

    it('formats with comma separator and ₫ suffix for ja', () => {
      const fmt = createFormatter('ja');
      expect(fmt.formatCurrency(1500000)).toBe('1,500,000₫');
    });

    it('formats zero correctly', () => {
      expect(createFormatter('vi').formatCurrency(0)).toBe('0 ₫');
      expect(createFormatter('en').formatCurrency(0)).toBe('₫0');
      expect(createFormatter('ja').formatCurrency(0)).toBe('0₫');
    });

    it('formats small amounts without separators', () => {
      expect(createFormatter('vi').formatCurrency(500)).toBe('500 ₫');
      expect(createFormatter('en').formatCurrency(500)).toBe('₫500');
      expect(createFormatter('ja').formatCurrency(500)).toBe('500₫');
    });

    it('formats large amounts correctly', () => {
      expect(createFormatter('vi').formatCurrency(999999999)).toBe('999.999.999 ₫');
      expect(createFormatter('en').formatCurrency(999999999)).toBe('₫999,999,999');
      expect(createFormatter('ja').formatCurrency(999999999)).toBe('999,999,999₫');
    });
  });

  describe('formatNumber', () => {
    it('uses dot separator for vi', () => {
      const fmt = createFormatter('vi');
      expect(fmt.formatNumber(1500000)).toBe('1.500.000');
    });

    it('uses comma separator for en', () => {
      const fmt = createFormatter('en');
      expect(fmt.formatNumber(1500000)).toBe('1,500,000');
    });

    it('uses comma separator for ja', () => {
      const fmt = createFormatter('ja');
      expect(fmt.formatNumber(1500000)).toBe('1,500,000');
    });

    it("formats zero as '0'", () => {
      expect(createFormatter('vi').formatNumber(0)).toBe('0');
      expect(createFormatter('en').formatNumber(0)).toBe('0');
      expect(createFormatter('ja').formatNumber(0)).toBe('0');
    });

    it('formats numbers under 1000 without separators', () => {
      expect(createFormatter('vi').formatNumber(999)).toBe('999');
      expect(createFormatter('en').formatNumber(999)).toBe('999');
      expect(createFormatter('ja').formatNumber(999)).toBe('999');
    });

    it('formats exactly 1000 with separator', () => {
      expect(createFormatter('vi').formatNumber(1000)).toBe('1.000');
      expect(createFormatter('en').formatNumber(1000)).toBe('1,000');
      expect(createFormatter('ja').formatNumber(1000)).toBe('1,000');
    });
  });

  describe('factory exhaustiveness', () => {
    it('creates formatters for all valid locales', () => {
      const locales: Locale[] = ['vi', 'en', 'ja'];
      for (const locale of locales) {
        const fmt = createFormatter(locale);
        expect(fmt.formatDate).toBeDefined();
        expect(fmt.formatCurrency).toBeDefined();
        expect(fmt.formatNumber).toBeDefined();
      }
    });
  });
});
