"use client";
import { useState } from "react";
import { calculateLoan } from "@/lib/loan";
const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
export function LoanCalculator() {
  const [balance, setBalance] = useState("30000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("10");
  const result = [balance, rate, years].every((value) => value.trim() !== "")
    ? calculateLoan(Number(balance), Number(rate), Number(years))
    : null;
  return (
    <section className="calculator" id="calculator">
      <div>
        <span className="eyebrow">DO THE MATH</span>
        <h2>What would the payment be?</h2>
        <p>A fixed-rate loan with equal monthly payments.</p>
      </div>
      <div className="calculator-inputs">
        <label>
          Loan balance ($)
          <input
            type="number"
            min="1"
            max="10000000"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
        </label>
        <label>
          Annual interest rate (%)
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </label>
        <label>
          Loan term (years)
          <input
            type="number"
            min="1"
            max="50"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </label>
      </div>
      <div className="calculator-results" aria-live="polite">
        {result ? (
          <>
            <div>
              <span>Monthly payment</span>
              <strong>{money(result.monthly)}</strong>
            </div>
            <div>
              <span>Total interest</span>
              <strong>{money(result.interest)}</strong>
            </div>
            <div>
              <span>Total repaid</span>
              <strong>{money(result.total)}</strong>
            </div>
          </>
        ) : (
          <p>
            Enter a balance between $1 and $10 million, a rate between 0% and
            100%, and a whole number of years from 1 to 50.
          </p>
        )}
      </div>
      <p className="calculator-note">
        For illustration only. Leaves out fees, assumes the rate never changes,
        and assumes no extra payments. Not an offer from any lender.
      </p>
    </section>
  );
}
