/**
 * Deterministic NGN money formatting and arithmetic helpers.
 *
 * Non-negotiable #10: all money calculations must be deterministic and
 * done here (or an equivalent server-side calculation layer) - never by
 * asking an LLM to compute or "estimate" a balance.
 *
 * Amounts are handled in kobo (integer, smallest NGN unit) internally to
 * avoid floating point drift, and only converted to naira for display.
 */

const NAIRA_FORMATTER = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

/** Convert a whole-naira input (e.g. a form field) to integer kobo. */
export function nairaToKobo(naira: number): number {
  if (!Number.isFinite(naira)) return 0;
  return Math.round(naira * 100);
}

export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

/** Format integer kobo as a localized NGN string, e.g. "₦12,000". */
export function formatKobo(kobo: number): string {
  const safe = Number.isFinite(kobo) ? kobo : 0;
  return NAIRA_FORMATTER.format(koboToNaira(safe));
}

/** Format a whole-naira number directly, e.g. for quick UI previews. */
export function formatNaira(naira: number): string {
  const safe = Number.isFinite(naira) ? naira : 0;
  return NAIRA_FORMATTER.format(safe);
}

export function sumKobo(amounts: number[]): number {
  return amounts.reduce((total, amount) => total + (Number.isFinite(amount) ? amount : 0), 0);
}

export function computeBalanceKobo(totalKobo: number, paidKobo: number): number {
  return Math.max(0, totalKobo - paidKobo);
}

export function computeMarginKobo(sellKobo: number, costKobo: number): number {
  return sellKobo - costKobo;
}

export function computeMarginPercent(sellKobo: number, costKobo: number): number {
  if (sellKobo <= 0) return 0;
  return Math.round(((sellKobo - costKobo) / sellKobo) * 100);
}
