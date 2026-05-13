/**
 * Shared coupon types used by both `apps/api` and `apps/web`.
 *
 * These interfaces define the canonical shapes for coupon entities and
 * creation requests. The API's class-based DTOs implement these interfaces;
 * the web client consumes them directly.
 */

import type { CouponDiscountType } from './enums';

/**
 * Coupon entity shape returned by the API.
 */
export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: CouponDiscountType | string;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request body for creating a new coupon (admin endpoint).
 */
export interface CreateCouponRequest {
  code: string;
  description?: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  validFrom: string;
  validUntil?: string;
  isActive?: boolean;
}
