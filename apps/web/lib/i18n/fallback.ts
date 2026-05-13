/**
 * Dynamic Content Locale Fallback Utility
 *
 * Provides functions to retrieve localized content from objects,
 * falling back to Vietnamese ("vi") when the active locale's value
 * is null, undefined, or empty string. Never throws.
 *
 * @module fallback
 */

import type { Locale } from './types';

/**
 * Returns the localized value from a content record keyed by locale.
 *
 * Lookup order:
 * 1. content[locale] — if non-null, non-undefined, and non-empty string
 * 2. content["vi"] — Vietnamese fallback
 * 3. "" — empty string (never throws)
 *
 * @param content - Object with locale keys mapping to string values (or null/undefined)
 * @param locale - The active locale to look up
 * @returns The localized string, Vietnamese fallback, or empty string
 */
export function getLocalizedContent(
  content: Record<string, string | null | undefined>,
  locale: Locale,
): string {
  // Guard against null/undefined content object
  if (!content || typeof content !== 'object') {
    return '';
  }

  const value = content[locale];
  if (value != null && value !== '') {
    return value;
  }

  // Fallback to Vietnamese
  const viValue = content['vi'];
  if (viValue != null && viValue !== '') {
    return viValue;
  }

  return '';
}

/**
 * Reads a localized field from an object using a field prefix and locale suffix.
 *
 * Given an object with fields like `nameVi`, `nameEn`, `nameJa`, this function
 * constructs the field name by combining the prefix with the capitalized locale code,
 * then applies the same fallback logic as getLocalizedContent.
 *
 * Lookup order:
 * 1. obj[`${fieldPrefix}${LocaleSuffix}`] — e.g. obj.nameEn
 * 2. obj[`${fieldPrefix}Vi`] — Vietnamese fallback
 * 3. "" — empty string (never throws)
 *
 * @param obj - Any object with locale-suffixed fields
 * @param fieldPrefix - The field name prefix (e.g. "name", "description", "title")
 * @param locale - The active locale
 * @returns The localized field value, Vietnamese fallback, or empty string
 */
export function getLocalizedField(
  obj: Record<string, unknown>,
  fieldPrefix: string,
  locale: Locale,
): string {
  // Guard against null/undefined obj
  if (!obj || typeof obj !== 'object') {
    return '';
  }

  // Guard against invalid fieldPrefix
  if (!fieldPrefix || typeof fieldPrefix !== 'string') {
    return '';
  }

  const suffix = capitalizeLocale(locale);
  const fieldName = `${fieldPrefix}${suffix}`;
  const value = obj[fieldName];

  if (typeof value === 'string' && value !== '') {
    return value;
  }

  // Fallback to Vietnamese field
  const viFieldName = `${fieldPrefix}Vi`;
  const viValue = obj[viFieldName];

  if (typeof viValue === 'string' && viValue !== '') {
    return viValue;
  }

  return '';
}

/**
 * Capitalizes a locale code for use as a field suffix.
 * "vi" → "Vi", "en" → "En", "ja" → "Ja"
 */
function capitalizeLocale(locale: string): string {
  if (!locale) return '';
  return locale.charAt(0).toUpperCase() + locale.slice(1).toLowerCase();
}
