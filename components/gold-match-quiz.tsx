"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "./icons";
import { ProviderLogo } from "./ui";
import { outboundRel } from "@/lib/commercial";
import {
  getVisibleQuestions,
  type GoldMatchResult,
  type GoldQuizAnswers,
  type QuizQuestionId,
} from "@/lib/gold-match";
import styles from "./gold-match-quiz.module.css";
import { useUnfinishedLeadBeacon } from "./use-unfinished-lead";

const LETTERS = ["A", "B", "C", "D", "E"];

function readUtmParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_content: params.get("utm_content") || undefined,
    utm_term: params.get("utm_term") || undefined,
  };
}

export function GoldMatchQuiz() {
  const [answers, setAnswers] = useState<GoldQuizAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GoldMatchResult | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const questions = getVisibleQuestions(answers);
  const totalQuestionSteps = questions.length;
  const isContactStep = stepIndex >= totalQuestionSteps;
  const currentQuestion = !isContactStep ? questions[stepIndex] : null;

  const progressPercent = result
    ? 100
    : isContactStep
      ? 92
      : Math.round(((stepIndex + 1) / (totalQuestionSteps + 1)) * 100);

  useUnfinishedLeadBeacon(
    "/api/gold-match",
    isContactStep && !result && !submitting,
    () => ({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.replace(/\D/g, ""),
      answers,
      lastStep: "contact form",
      landingPageUrl: window.location.href,
      referrerUrl: document.referrer || undefined,
      utms: readUtmParams(),
    }),
  );

  function handleSelectOption(questionId: QuizQuestionId, value: string) {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);

    const nextAnswers: GoldQuizAnswers = {
      ...answers,
      [questionId]: value,
    };
    if (questionId === "hasRetirementAccount" && value === "no") {
      delete nextAnswers.accountLocation;
    }
    setAnswers(nextAnswers);
    setError(null);

    const updatedQuestions = getVisibleQuestions(nextAnswers);
    advanceTimer.current = setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, updatedQuestions.length));
    }, 170);
  }

  function handleBack() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setError(null);
    setStepIndex((prev) => Math.max(0, prev - 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const digits = phone.replace(/\D/g, "");
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (digits.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!consent) {
      setError(
        "Please confirm contact consent so we can deliver your matches.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/gold-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: digits,
          consent,
          answers,
          landingPageUrl: window.location.href,
          referrerUrl: document.referrer || undefined,
          utms: readUtmParams(),
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        match?: GoldMatchResult;
      };

      if (!response.ok || !data.match) {
        setError(
          data.error || "Could not prepare your matches. Please try again.",
        );
        return;
      }

      setResult(data.match);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(
        "Connection error while loading your matches. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetake() {
    setAnswers({});
    setStepIndex(0);
    setResult(null);
    setError(null);
  }

  return (
    <>
      <section className={styles.page}>
        <div className="container">
          {result ? (
            <div className={styles.resultsShell}>
              <div className={styles.resultsHeader}>
                <div className={styles.resultsTopRow}>
                  <span className="eyebrow">YOUR GOLD IRA MATCH SUMMARY</span>
                  <span className={styles.tierBadge}>
                    <Icon name="check" size={14} /> {result.tier}
                  </span>
                </div>
                <h1 className={styles.resultsTitle}>{result.summaryHeading}</h1>
                <p className={styles.resultsLead}>{result.summaryBody}</p>
                <div className={styles.chipsRow}>
                  {result.chips.map((chip) => (
                    <div className={styles.summaryChip} key={chip.label}>
                      <span>{chip.label}:</span>
                      <strong>{chip.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`${styles.matchesGrid} ${
                  result.matches.length === 1 ? styles.matchesGridSingle : ""
                }`}
              >
                {result.matches.map((item, idx) => (
                  <article
                    key={item.provider.id}
                    className={`${styles.matchCard} ${
                      idx === 0 ? styles.matchCardPrimary : ""
                    }`}
                  >
                    <div className={styles.matchCardTop}>
                      <span className={styles.matchRankPill}>
                        {result.matches.length > 1
                          ? `Match #${idx + 1}`
                          : "Your match"}
                      </span>
                      {item.sponsored && (
                        <Link
                          className="sponsored-tag"
                          href="/advertising-disclosure"
                        >
                          Sponsored
                        </Link>
                      )}
                    </div>

                    <div className={styles.matchBrandRow}>
                      <ProviderLogo provider={item.provider} />
                      <div>
                        <h3>{item.provider.name}</h3>
                        <p className={styles.matchFit}>{item.matchHeadline}</p>
                      </div>
                    </div>

                    <div className={styles.matchWhyBox}>
                      <strong>Why this fits your answers</strong>
                      <p>{item.matchReason}</p>
                    </div>

                    <div className={styles.matchMeta}>
                      <div>
                        <strong>Minimum:</strong>{" "}
                        {item.provider.minimum || "Confirm directly in writing"}
                      </div>
                      <div>
                        <strong>Key strengths:</strong>{" "}
                        {item.provider.strengths.join(" · ")}
                      </div>
                      <div>
                        <strong>Fine print to check:</strong>{" "}
                        {item.provider.limitation}
                      </div>
                    </div>

                    <div className={styles.matchActions}>
                      <a
                        className="button"
                        href={item.provider.domain}
                        target="_blank"
                        rel={outboundRel(item.provider.id)}
                      >
                        Visit {item.provider.name}{" "}
                        <Icon name="external" size={15} />
                      </a>
                      <Link
                        className="button button-outline"
                        href={`/reviews/${item.provider.id}`}
                      >
                        Read our review
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <div className={styles.resultsActions}>
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={handleRetake}
                >
                  ← Retake match quiz
                </button>
                <Link className="inline-link" href="/gold/best-gold-companies">
                  Compare all 7 gold companies side by side{" "}
                  <Icon name="arrow" size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.heroGrid}>
              <div className={styles.introCol}>
                <div className={styles.eyebrowRow}>
                  <span className={styles.eyebrowDot} />
                  GOLD IRA MATCHING TOOL · 2026
                </div>
                <h1 className={styles.title}>
                  Find your best Gold IRA match <em>in 2 minutes.</em>
                </h1>
                <p className={styles.lead}>
                  See which gold IRA providers fit your age, retirement account,
                  balance, and timeline — with written fee and buyback questions
                  spelled out before you talk to anyone.
                </p>

                <div className={styles.trustList}>
                  <div className={styles.trustItem}>
                    <span className={styles.trustIcon}>
                      <Icon name="shield" size={18} />
                    </span>
                    <div>
                      <strong>Independent comparison criteria</strong>
                      <span>
                        Evaluated on all-in premiums over spot, custodian chain,
                        and written buyback terms.
                      </span>
                    </div>
                  </div>
                  <div className={styles.trustItem}>
                    <span className={styles.trustIcon}>
                      <Icon name="clock" size={18} />
                    </span>
                    <div>
                      <strong>Takes less than 2 minutes</strong>
                      <span>
                        Five focused questions tailored to rollover eligibility
                        and account minimums.
                      </span>
                    </div>
                  </div>
                  <div className={styles.trustItem}>
                    <span className={styles.trustIcon}>
                      <Icon name="check" size={18} />
                    </span>
                    <div>
                      <strong>Instant on-screen match</strong>
                      <span>
                        See your matched gold specialist immediately with no
                        account setup required.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={styles.quizCard}
                aria-label="Gold IRA matching questionnaire"
              >
                <div className={styles.progressHeader}>
                  <span className={styles.stepText}>
                    {isContactStep
                      ? "Final step: Unlock your match"
                      : `Question ${stepIndex + 1} of ${totalQuestionSteps}`}
                  </span>
                  <span className={styles.percentPill}>{progressPercent}%</span>
                </div>
                <div
                  className={styles.progressTrack}
                  role="progressbar"
                  aria-valuenow={progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {currentQuestion ? (
                  <div
                    key={currentQuestion.id}
                    className={styles.questionStage}
                  >
                    <span className={styles.stepEyebrow}>
                      {currentQuestion.stepLabel}
                    </span>
                    <h2 className={styles.questionPrompt}>
                      {currentQuestion.prompt}
                    </h2>
                    <p className={styles.questionHelper}>
                      {currentQuestion.helper}
                    </p>

                    <div className={styles.optionsGrid} role="radiogroup">
                      {currentQuestion.options.map((opt, idx) => {
                        const selected =
                          answers[currentQuestion.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            className={`${styles.optionButton} ${
                              selected ? styles.optionSelected : ""
                            }`}
                            onClick={() =>
                              handleSelectOption(currentQuestion.id, opt.value)
                            }
                          >
                            <span className={styles.optionLeft}>
                              <span className={styles.optionKey}>
                                {LETTERS[idx]}
                              </span>
                              <span>
                                <span className={styles.optionLabel}>
                                  {opt.label}
                                </span>
                                {opt.detail && (
                                  <span className={styles.optionDetail}>
                                    {opt.detail}
                                  </span>
                                )}
                              </span>
                            </span>
                            <span className={styles.optionCheck}>
                              <Icon name="check" size={18} />
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className={styles.cardFooter}>
                      {stepIndex > 0 ? (
                        <button
                          type="button"
                          className={styles.backButton}
                          onClick={handleBack}
                        >
                          ← Back
                        </button>
                      ) : (
                        <span className={styles.privacyNote}>
                          No credit impact · Free comparison
                        </span>
                      )}
                      {answers[currentQuestion.id] ? (
                        <button
                          type="button"
                          className="button small"
                          onClick={() =>
                            setStepIndex((prev) =>
                              Math.min(prev + 1, totalQuestionSteps),
                            )
                          }
                        >
                          Continue <Icon name="arrow" size={15} />
                        </button>
                      ) : (
                        stepIndex > 0 && (
                          <span className={styles.privacyNote}>
                            Select an option to continue
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <form
                    className={styles.questionStage}
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <span className={styles.stepEyebrow}>MATCHES READY</span>
                    <h2 className={styles.questionPrompt}>
                      Where should we send your personalized Gold IRA match?
                    </h2>
                    <p className={styles.questionHelper}>
                      Enter your contact details to see your match immediately
                      and receive your summary.
                    </p>

                    <div className={styles.formGrid}>
                      <div className={styles.field}>
                        <label htmlFor="quiz-first-name">First name</label>
                        <input
                          id="quiz-first-name"
                          name="firstName"
                          autoComplete="given-name"
                          placeholder="Jane"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="quiz-last-name">Last name</label>
                        <input
                          id="quiz-last-name"
                          name="lastName"
                          autoComplete="family-name"
                          placeholder="Smith"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                      <div className={`${styles.field} ${styles.fieldFull}`}>
                        <label htmlFor="quiz-email">Email address</label>
                        <input
                          id="quiz-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="jane@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className={`${styles.field} ${styles.fieldFull}`}>
                        <label htmlFor="quiz-phone">Phone number</label>
                        <input
                          id="quiz-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="(555) 234-5678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <label className={styles.consentRow}>
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                      />
                      <span>
                        By clicking &ldquo;See My Gold Match,&rdquo; I agree to
                        the{" "}
                        <Link href="/privacy" target="_blank">
                          Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link href="/terms" target="_blank">
                          Terms
                        </Link>
                        , and consent to be contacted by Top Provider Picks and
                        matched gold IRA partners (including Citadel Gold) by
                        phone, SMS, or email at the number and email provided,
                        including via automated dialing or prerecorded messages,
                        even if on a Do Not Call list. Consent is not required
                        to purchase.
                      </span>
                    </label>

                    {error && (
                      <div className={styles.errorBanner} role="alert">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`button ${styles.submitButton}`}
                      disabled={submitting}
                    >
                      {submitting
                        ? "Matching your profile..."
                        : "See My Gold Match"}
                      {!submitting && <Icon name="arrow" size={17} />}
                    </button>

                    <div className={styles.cardFooter}>
                      <button
                        type="button"
                        className={styles.backButton}
                        onClick={handleBack}
                        disabled={submitting}
                      >
                        ← Back
                      </button>
                      <span className={styles.privacyNote}>
                        Encrypted · Takes under 2 minutes
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className={styles.supportSection}>
        <div className="container">
          <span className="eyebrow">HOW YOUR MATCH WORKS</span>
          <h2 className="section-title" style={{ marginTop: "8px" }}>
            What happens after you finish the quiz
          </h2>
          <div className={styles.supportGrid}>
            <div className={styles.supportCard}>
              <span className={styles.supportStep}>1</span>
              <h3>Instant specialist match</h3>
              <p>
                We line up your age, account type, balance range, and timeline
                against account minimums and IRA rollover requirements.
              </p>
            </div>
            <div className={styles.supportCard}>
              <span className={styles.supportStep}>2</span>
              <h3>Fine print up front</h3>
              <p>
                Your match card highlights the stated minimum, key strengths,
                and the fee or buyback questions to ask in writing first.
              </p>
            </div>
            <div className={styles.supportCard}>
              <span className={styles.supportStep}>3</span>
              <h3>Direct specialist follow-up</h3>
              <p>
                A specialist from your matched company may reach out by phone or
                email to walk through rollover rules and current pricing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
