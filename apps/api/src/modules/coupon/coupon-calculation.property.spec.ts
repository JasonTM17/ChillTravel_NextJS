// Feature: wanderviet-pro-upgrade-plan, Property 2: Coupon Calculation Invariants
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

import {
  couponInputArb,
  couponPercentArb,
  couponFixedAmountArb,
  monetaryAmountArb,
  PBT_NUM_RUNS,
} from '../../test-utils/pbt-helpers';
import { applyCoupon } from './utils/coupon-calculator';

/**
 * **Validates: Requirements 3.5, 3.6**
 *
 * Property 2: Coupon Calculation Invariants
 *
 * For any coupon application:
 * - PERCENT (p ∈ [0,100], total ≥ 0):
 *   discount = Math.round(total × p / 100), final = total - discount,
 *   final >= 0, final <= total
 * - FIXED (f ≥ 0, total ≥ 0):
 *   final = Math.max(total - f, 0), final >= 0
 */
describe('Property 2: Coupon Calculation Invariants', () => {
  describe('PERCENT discount type', () => {
    it('discount equals Math.round(total * p / 100)', () => {
      fc.assert(
        fc.property(monetaryAmountArb, couponPercentArb, (total, percent) => {
          const result = applyCoupon({
            discountType: 'PERCENT',
            discountValue: percent,
            total,
          });
          const expectedDiscount = Math.round((total * percent) / 100);
          expect(result.discount).toBe(expectedDiscount);
        }),
        { numRuns: PBT_NUM_RUNS, seed: Date.now() },
      );
    });

    it('final equals total - discount', () => {
      fc.assert(
        fc.property(monetaryAmountArb, couponPercentArb, (total, percent) => {
          const result = applyCoupon({
            discountType: 'PERCENT',
            discountValue: percent,
            total,
          });
          expect(result.final).toBe(total - result.discount);
        }),
        { numRuns: PBT_NUM_RUNS, seed: Date.now() },
      );
    });

    it('final is non-negative and does not exceed total', () => {
      fc.assert(
        fc.property(monetaryAmountArb, couponPercentArb, (total, percent) => {
          const result = applyCoupon({
            discountType: 'PERCENT',
            discountValue: percent,
            total,
          });
          expect(result.final).toBeGreaterThanOrEqual(0);
          expect(result.final).toBeLessThanOrEqual(total);
        }),
        { numRuns: PBT_NUM_RUNS, seed: Date.now() },
      );
    });
  });

  describe('FIXED discount type', () => {
    it('final equals Math.max(total - f, 0)', () => {
      fc.assert(
        fc.property(monetaryAmountArb, couponFixedAmountArb, (total, fixedAmount) => {
          const result = applyCoupon({
            discountType: 'FIXED',
            discountValue: fixedAmount,
            total,
          });
          const expectedFinal = Math.max(total - fixedAmount, 0);
          expect(result.final).toBe(expectedFinal);
        }),
        { numRuns: PBT_NUM_RUNS, seed: Date.now() },
      );
    });

    it('discount equals total - final', () => {
      fc.assert(
        fc.property(monetaryAmountArb, couponFixedAmountArb, (total, fixedAmount) => {
          const result = applyCoupon({
            discountType: 'FIXED',
            discountValue: fixedAmount,
            total,
          });
          expect(result.discount).toBe(total - result.final);
        }),
        { numRuns: PBT_NUM_RUNS, seed: Date.now() },
      );
    });

    it('final is non-negative', () => {
      fc.assert(
        fc.property(monetaryAmountArb, couponFixedAmountArb, (total, fixedAmount) => {
          const result = applyCoupon({
            discountType: 'FIXED',
            discountValue: fixedAmount,
            total,
          });
          expect(result.final).toBeGreaterThanOrEqual(0);
        }),
        { numRuns: PBT_NUM_RUNS, seed: Date.now() },
      );
    });
  });

  describe('General invariants (both types)', () => {
    it('final is always non-negative and does not exceed total for any valid input', () => {
      fc.assert(
        fc.property(couponInputArb, (input) => {
          const result = applyCoupon(input);
          expect(result.final).toBeGreaterThanOrEqual(0);
          expect(result.final).toBeLessThanOrEqual(input.total);
        }),
        { numRuns: PBT_NUM_RUNS, seed: Date.now() },
      );
    });

    it('discount + final always equals total', () => {
      fc.assert(
        fc.property(couponInputArb, (input) => {
          const result = applyCoupon(input);
          expect(result.discount + result.final).toBe(input.total);
        }),
        { numRuns: PBT_NUM_RUNS, seed: Date.now() },
      );
    });
  });
});
