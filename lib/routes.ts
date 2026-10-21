import { categories } from "./catalog";
export const aliases: Record<string, string> = {
  ...Object.fromEntries(
    categories.map((c) => [
      `/best-${c.id === "banking" ? "banks" : c.id === "gold" ? "gold-companies" : c.id === "mortgages" ? "mortgage-companies" : c.id === "personal-injury" ? "personal-injury-law-firms" : c.id === "student-loans" ? "student-loan-refinance" : c.id === "lemon-law" ? "lemon-law-lawyers" : c.id === "debt-relief" ? "debt-relief-companies" : c.id === "credit-repair" ? "credit-repair-companies" : c.id === "investing" ? "investment-companies" : "credit-cards"}`,
      c.path,
    ]),
  ),
  "/gold": "/gold/best-gold-companies",
  "/mortgages": "/mortgages/best-mortgage-lenders",
  "/student-loans": "/student-loans/best-refinance-lenders",
  "/banking": "/banking/best-banks",
  "/investing": "/investing/best-investment-companies",
};
