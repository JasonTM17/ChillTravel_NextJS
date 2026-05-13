import { describe, expect, it, vi } from 'vitest';
import { ensureUniqueSlug, generateSlug } from './slug.util';

describe('generateSlug', () => {
  it('strips Vietnamese diacritics', () => {
    expect(generateSlug('Hà Nội')).toBe('ha-noi');
    expect(generateSlug('Hội An')).toBe('hoi-an');
    expect(generateSlug('Phú Quốc')).toBe('phu-quoc');
    expect(generateSlug('Sapa')).toBe('sapa');
  });

  it('converts đ/Đ to d/D (which slugify alone does not)', () => {
    expect(generateSlug('Đà Nẵng')).toBe('da-nang');
    expect(generateSlug('Điện Biên')).toBe('dien-bien');
  });

  it('returns empty string for empty/null/undefined input', () => {
    expect(generateSlug('')).toBe('');
    expect(generateSlug(null)).toBe('');
    expect(generateSlug(undefined)).toBe('');
  });

  it('collapses whitespace and punctuation', () => {
    expect(generateSlug('Northern Vietnam Adventure')).toBe('northern-vietnam-adventure');
    expect(generateSlug('Tour: 7 ngày / 6 đêm')).toBe('tour-7-ngay-6-dem');
  });

  it('is deterministic (same input → same output)', () => {
    expect(generateSlug('Hội An')).toBe(generateSlug('Hội An'));
  });
});

describe('ensureUniqueSlug', () => {
  it('returns the base slug when it is free', async () => {
    const exists = vi.fn().mockResolvedValue(false);
    await expect(ensureUniqueSlug('ha-noi', exists)).resolves.toBe('ha-noi');
    expect(exists).toHaveBeenCalledTimes(1);
  });

  it('appends -1 when only the base exists', async () => {
    const taken = new Set(['ha-noi']);
    const exists = vi.fn(async (slug: string) => taken.has(slug));
    await expect(ensureUniqueSlug('ha-noi', exists)).resolves.toBe('ha-noi-1');
  });

  it('appends -2 when base and base-1 both exist', async () => {
    const taken = new Set(['ha-noi', 'ha-noi-1']);
    const exists = vi.fn(async (slug: string) => taken.has(slug));
    await expect(ensureUniqueSlug('ha-noi', exists)).resolves.toBe('ha-noi-2');
  });

  it('throws when all attempts up to maxAttempts are taken', async () => {
    const exists = vi.fn().mockResolvedValue(true);
    await expect(ensureUniqueSlug('ha-noi', exists, 3)).rejects.toThrow(/exhausted 3 attempts/);
  });

  it('throws on empty base slug', async () => {
    await expect(ensureUniqueSlug('', async () => false)).rejects.toThrow(
      /baseSlug must be non-empty/,
    );
  });
});
