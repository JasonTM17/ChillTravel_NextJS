/**
 * i18n Module Entry Point
 *
 * Re-exports all types and provides the getTranslations(locale) function.
 * Maintains backward compatibility with the existing Lang type.
 */

// Re-export all types from the types module
export type {
  Locale,
  TranslationNamespace,
  NavTranslations,
  CommonTranslations,
  BookingTranslations,
  SearchTranslations,
  HotelTranslations,
  FlightTranslations,
  MapTranslations,
  PromoTranslations,
  StatusTranslations,
  ErrorTranslations,
} from './types';

export { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './types';

// Re-export fallback utilities
export { getLocalizedContent, getLocalizedField } from './fallback';

// Re-export formatter
export type { LocaleFormatter } from './formatter';
export { createFormatter } from './formatter';

// Re-export useLocale hook and LocaleProvider
export type { UseLocaleReturn, LocaleProviderProps } from './use-locale';
export { useLocale, LocaleProvider, LOCALE_STORAGE_KEY, parseStoredLocale } from './use-locale';

import type { Locale, TranslationNamespace } from './types';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './types';

// ─── Backward Compatibility ──────────────────────────────────────────────────

/** @deprecated Use `Locale` instead */
export type Lang = 'vi' | 'en';

// ─── Locale Validation ───────────────────────────────────────────────────────

/**
 * Checks if a value is a valid Locale.
 * Used for runtime validation of localStorage values and URL params.
 */
export function isValidLocale(value: unknown): value is Locale {
  return typeof value === 'string' && SUPPORTED_LOCALES.includes(value as Locale);
}

/**
 * Safely parses a locale value, returning the default if invalid.
 */
export function parseLocale(value: unknown): Locale {
  return isValidLocale(value) ? value : DEFAULT_LOCALE;
}

// ─── Translation Loading ─────────────────────────────────────────────────────

/**
 * Lazily loads and returns the translations for a given locale.
 * Each locale file implements TranslationNamespace exactly,
 * ensuring compile-time type safety.
 *
 * @param locale - The locale to load translations for
 * @returns The full TranslationNamespace for the given locale
 */
export async function getTranslations(locale: Locale): Promise<TranslationNamespace> {
  switch (locale) {
    case 'vi': {
      const mod = await import('./locales/vi');
      return mod.default;
    }
    case 'en': {
      const mod = await import('./locales/en');
      return mod.default;
    }
    case 'ja': {
      const mod = await import('./locales/ja');
      return mod.default;
    }
    default: {
      // Exhaustive check — TypeScript will error if a locale is unhandled
      const _exhaustive: never = locale;
      throw new Error(`Unsupported locale: ${_exhaustive}`);
    }
  }
}

/**
 * Synchronous version that returns translations from a pre-loaded map.
 * Use this when translations are already loaded (e.g., in React context).
 */
export function getTranslationsSync(
  locale: Locale,
  loadedTranslations: Record<Locale, TranslationNamespace>,
): TranslationNamespace {
  return loadedTranslations[locale];
}

// ─── Legacy Exports (backward compatibility) ─────────────────────────────────

/**
 * @deprecated Use the new typed locale system with getTranslations() instead.
 * Kept for backward compatibility during migration.
 */
export const translations = {
  vi: {
    nav: {
      home: 'Trang chủ',
      explore: 'Khám phá',
      tours: 'Tour',
      destinations: 'Điểm đến',
      blog: 'Blog',
      login: 'Đăng nhập',
      register: 'Đăng ký',
      profile: 'Hồ sơ',
      myBookings: 'Đặt chỗ của tôi',
      wishlist: 'Yêu thích',
      logout: 'Đăng xuất',
      admin: 'Quản trị',
    },
    common: {
      search: 'Tìm kiếm',
      loading: 'Đang tải...',
      error: 'Có lỗi xảy ra',
      retry: 'Thử lại',
      save: 'Lưu',
      cancel: 'Hủy',
      delete: 'Xóa',
      edit: 'Sửa',
      add: 'Thêm',
      confirm: 'Xác nhận',
      back: 'Quay lại',
      viewAll: 'Xem tất cả',
      viewDetail: 'Xem chi tiết',
    },
    booking: {
      book: 'Đặt tour',
      guests: 'Khách',
      departure: 'Ngày khởi hành',
      coupon: 'Mã giảm giá',
      total: 'Tổng cộng',
      paymentWarning: 'Thanh toán demo — không phát sinh giao dịch thật',
    },
    status: {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      cancelled: 'Đã hủy',
      completed: 'Hoàn thành',
      active: 'Hoạt động',
      inactive: 'Ẩn',
    },
  },
  en: {
    nav: {
      home: 'Home',
      explore: 'Explore',
      tours: 'Tours',
      destinations: 'Destinations',
      blog: 'Blog',
      login: 'Login',
      register: 'Register',
      profile: 'Profile',
      myBookings: 'My Bookings',
      wishlist: 'Wishlist',
      logout: 'Logout',
      admin: 'Admin',
    },
    common: {
      search: 'Search',
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      confirm: 'Confirm',
      back: 'Back',
      viewAll: 'View all',
      viewDetail: 'View detail',
    },
    booking: {
      book: 'Book tour',
      guests: 'Guests',
      departure: 'Departure date',
      coupon: 'Coupon code',
      total: 'Total',
      paymentWarning: 'Demo payment — no real transaction',
    },
    status: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed',
      active: 'Active',
      inactive: 'Hidden',
    },
  },
} as const;

/** @deprecated Use `TranslationNamespace` instead */
export type Translations = typeof translations.vi;
