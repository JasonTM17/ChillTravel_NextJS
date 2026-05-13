import { describe, expect, it } from 'vitest';
import { filterDestinations, getFeaturedDestinations } from './travel';

describe('travel utilities', () => {
  it('returns featured destinations', () => {
    expect(getFeaturedDestinations().length).toBeGreaterThan(3);
  });

  it('filters destination search', () => {
    expect(filterDestinations('Da Nang').some((item) => item.slug === 'da-nang')).toBe(true);
  });
});
