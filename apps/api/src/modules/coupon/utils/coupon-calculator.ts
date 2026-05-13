/**
 * Coupon Calculator — pure function for computing coupon discounts.
 *
 * Supports two discount types:
 * - PERCENT: discount = Math.round(total × p / 100), final = total - discount
 * - FIXED:   final = Math.max(total - f, 0), discount = total - final
 *
 * Invariants (for all valid inputs):
 * - final >= 0
 * - final <= total
 * - discount >= 0
 * - discount + final === total (for PERCENT)
 *
 * @see Requirements 3.5, 3.6
 * @see Design: Property 2 — Coupon Calculation Invariants
 */

export interface CouponInput {
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number; // p ∈ [0,100] for PERCENT, f ≥ 0 for FIXED
  total: number; // total ≥ 0
}

export interface CouponResult {
  discount: number;
  final: number;
}

/**
 * Applies a coupon discount to a total amount.
 *
 * @param input - The coupon parameters and total amount
 * @returns The computed discount and final amount
 *
 * @example
 * applyCoupon({ discountType: 'PERCENT', discountValue: 10, total: 1000 })
 * // => { discount: 100, final: 900 }
 *
 * @example
 * applyCoupon({ discountType: 'FIXED', discountValue: 500, total: 300 })
 * // => { discount: 300, final: 0 }
 */
export function applyCoupon(input: CouponInput): CouponResult {
  const { discountType, discountValue, total } = input;

  if (discountType === 'PERCENT') {
    const discount = Math.round((total * discountValue) / 100);
    const final = total - discount;
    return { discount, final };
  }

  // FIXED
  const final = Math.max(total - discountValue, 0);
  const discount = total - final;
  return { discount, final };
}
