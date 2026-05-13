/**
 * Currency conversion configuration.
 * Hardcoded rates for demo — TODO: integrate live exchange rate API.
 *
 * Req 36 / Design §18.5.
 */

export const CURRENCY_RATES: Record<string, number> = {
  VND: 1,
  USD: 25000, // 1 USD = 25,000 VND
  EUR: 27000, // 1 EUR = 27,000 VND
  JPY: 170, // 1 JPY = 170 VND
  SGD: 18500, // 1 SGD = 18,500 VND
};

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_RATES);

/**
 * Convert a VND amount to the target currency.
 * Returns the original amount if the currency is not supported.
 */
export function convertFromVnd(amountVnd: number, targetCurrency: string): number {
  const rate = CURRENCY_RATES[targetCurrency.toUpperCase()];
  if (!rate || rate === 1) return amountVnd;
  return Math.round(amountVnd / rate);
}

/**
 * Convert an amount in the source currency to VND.
 */
export function convertToVnd(amount: number, sourceCurrency: string): number {
  const rate = CURRENCY_RATES[sourceCurrency.toUpperCase()];
  if (!rate || rate === 1) return amount;
  return Math.round(amount * rate);
}
