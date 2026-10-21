/** Fixed-rate, fully amortizing loan; fees and extra payments are excluded. */
export function calculateLoan(
  principal: number,
  annualRate: number,
  years: number,
) {
  if (
    ![principal, annualRate, years].every(Number.isFinite) ||
    principal < 1 ||
    principal > 10_000_000 ||
    annualRate < 0 ||
    annualRate > 100 ||
    !Number.isInteger(years) ||
    years < 1 ||
    years > 50
  )
    return null;
  const months = years * 12;
  const monthlyRate = annualRate / 1200;
  // log1p/expm1 keep very small positive rates numerically stable.
  const monthly =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) /
        -Math.expm1(-months * Math.log1p(monthlyRate));
  const total = monthly * months;
  return { monthly, total, interest: Math.max(0, total - principal), months };
}
