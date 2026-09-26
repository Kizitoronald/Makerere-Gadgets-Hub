/**
 * Ugandan Shilling (UGX) Currency Formatter
 * Strict rule: Always display in UGX with thousand separators, never dollars.
 */
export function formatUGX(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return 'UGX 0';
  }
  const numericAmount = Math.round(Number(amount));
  return `UGX ${numericAmount.toLocaleString('en-US')}`;
}

/**
 * Calculates discount percentage
 */
export function calculateDiscount(currentPrice: number, previousPrice?: number): number {
  if (!previousPrice || previousPrice <= currentPrice) return 0;
  return Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
}
