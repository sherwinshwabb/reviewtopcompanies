import { categoryById } from "./catalog";

export const primaryCategories = [
  ["investing", "Investment Companies"],
  ["gold", "Gold Investment Companies"],
  ["banking", "Top Banks"],
  ["credit-cards", "Credit Cards"],
  ["credit-repair", "Credit Repair"],
  ["debt-relief", "Debt Relief"],
  ["personal-injury", "Personal Injury"],
  ["lemon-law", "Lemon Law"],
].map(([id, title]) => ({ ...categoryById(id), title }));
