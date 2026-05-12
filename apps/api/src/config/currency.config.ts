/**
 * Currency conversion configuration.
 *
 * Rates are hardcoded for demo purposes. In production, replace with a
 * live exchange-rate API adapter (e.g. Open Exchange Rates, Fixer.io).
 *
 * Design §18.13 / Req 36.
 */

/** Supported currency codes. */
export type CurrencyCode = "VND" | "USD";

/** Hardcoded exchange rates relative to VND (1 VND = X currency). */
const RATES: Record<CurrencyCode, number> = {
  VND: 1,
  USD: 1 / 25_000, // 1 USD ≈ 25,000 VND
};

/**
 * Convert an amount from VND to the target currency.
 * Returns the original amount unchanged if the currency is VND or unknown.
 */
export function convertFromVnd(amountVnd: number, to: CurrencyCode): number {
  const rate = RATES[to] ?? 1;
  return Math.round(amountVnd * rate * 100) / 100;
}

/**
 * Parse a currency query param string into a supported CurrencyCode.
 * Falls back to "VND" for unknown values.
 */
export function parseCurrency(raw?: string): CurrencyCode {
  if (raw === "USD") return "USD";
  return "VND";
}
