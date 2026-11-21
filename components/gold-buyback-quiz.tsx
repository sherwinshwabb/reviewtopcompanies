"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import { ProviderLogo } from "./ui";
import { providerById } from "@/lib/catalog";
import {
  BUYBACK_MATCHED_PROVIDER_ID,
  BUYBACK_QUESTIONS,
  buybackSummary,
  type BuybackAnswers,
  type BuybackIcon,
  type BuybackQuestionId,
} from "@/lib/gold-buyback";
import styles from "./gold-buyback-quiz.module.css";
import { useUnfinishedLeadBeacon } from "./use-unfinished-lead";

const COIN_SRC = "/images/buyback/liberty-coin.png";
const QUESTION_COUNT = BUYBACK_QUESTIONS.length;

type Stage =
  | { kind: "intro" }
  | { kind: "question"; index: number }
  | { kind: "form" }
  | { kind: "done"; firstName: string };

const ICON_PATHS: Record<Exclude<BuybackIcon, "coin">, React.ReactNode> = {
  slab: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2" />
      <path d="M8.5 6h7" />
      <circle cx="12" cy="14" r="4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5Z" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4" />
      <circle cx="12" cy="16.6" r=".6" />
    </>
  ),
  vault: (
    <path d="M4 9.5 12 4l8 5.5M5.5 10v8M10 10v8M14 10v8M18.5 10v8M3.5 20h17" />
  ),
  home: (
    <>
      <path d="M4 11 12 4.5l8 6.5M6 9.5V20h12V9.5" />
      <rect x="10" y="14" width="4" height="6" />
    </>
  ),
  split: (
    <>
      <rect x="3.5" y="5" width="7" height="14" rx="1.5" />
      <rect x="13.5" y="5" width="7" height="14" rx="1.5" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3-8.7 8.7-8.3-8.3Z" />
      <circle cx="8" cy="8" r="1.2" />
    </>
  ),
  down: <path d="M4 6l6 6 4-4 6 6M20 9.5V14h-4.5" />,
  receipt: (
    <>
      <path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3v-17Z" />
      <path d="M9 8.5h6M9 12h6" />
    </>
  ),
  phone: (
    <path d="M6.6 3.5h2.6l1.4 4-2 1.5a11 11 0 0 0 6.4 6.4l1.5-2 4 1.4v2.6A2 2 0 0 1 18.5 19 15.5 15.5 0 0 1 5 5.5a2 2 0 0 1 1.6-2Z" />
  ),
};

function OptionIcon({ icon }: { icon: BuybackIcon }) {
  if (icon === "coin") {
    return <Image src={COIN_SRC} alt="" width={34} height={34} />;
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[icon]}
    </svg>
  );
}

function readUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_content: params.get("utm_content") || undefined,
    utm_term: params.get("utm_term") || undefined,
  };
}

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function GoldBuybackQuiz() {
  const provider = providerById(BUYBACK_MATCHED_PROVIDER_ID);
  const [stage, setStage] = useState<Stage>({ kind: "intro" });
  const [answers, setAnswers] = useState<BuybackAnswers>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  // Keep the top of the card in view as the visitor moves between steps.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = shellRef.current;
    if (el && el.getBoundingClientRect().top < 0) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [stage]);

  useUnfinishedLeadBeacon(
    "/api/gold-buyback",
    stage.kind === "form" && !submitting,
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

  function goTo(next: Stage) {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setError(null);
    setStage(next);
  }

  function nextAfterQuestion(index: number): Stage {
    return index + 1 < QUESTION_COUNT
      ? { kind: "question", index: index + 1 }
      : { kind: "form" };
  }

  function handleSelect(id: BuybackQuestionId, value: string, index: number) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(
      () => goTo(nextAfterQuestion(index)),
      220,
    );
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
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/gold-buyback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: digits,
          // Submitting the form is the consent action described below the button.
          consent: true,
          answers,
          landingPageUrl: window.location.href,
          referrerUrl: document.referrer || undefined,
          utms: readUtmParams(),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!response.ok || !data.ok) {
        setError(
          data.error || "We couldn't send your request. Please try again.",
        );
        return;
      }
      goTo({ kind: "done", firstName: firstName.trim() });
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const questionIndex = stage.kind === "question" ? stage.index : -1;
  const q = questionIndex >= 0 ? BUYBACK_QUESTIONS[questionIndex] : null;
  const selected = q ? answers[q.id] : undefined;
  const pct = ((questionIndex + 1) / QUESTION_COUNT) * 100;

  return (
    <section className={styles.page}>
      <div className={styles.shell} ref={shellRef}>
        {stage.kind === "intro" && (
          <div className={styles.stage}>
            <div className={styles.hero}>
              <div className={styles.heroGrid} aria-hidden="true" />
              <div className={styles.heroGlow} aria-hidden="true" />
              <Image
                className={styles.heroCoin}
                src={COIN_SRC}
                alt=""
                width={260}
                height={260}
                priority
              />
              <div className={styles.heroCopy}>
                <span className={`${styles.eyebrow} ${styles.eyebrowGold}`}>
                  Buyback review · 2026
                </span>
                <h1 className={styles.heroTitle}>
                  Overpaid for gold? Let’s <em>check.</em>
                </h1>
              </div>
              <div className={styles.heroChip}>
                <i aria-hidden="true" />
                Free to use · Takes about 60 seconds
              </div>
            </div>

            <div className={styles.body}>
              <p className={styles.lede}>
                Collector and “limited edition” coins often sell at{" "}
                <b>premiums far above their metal value.</b> Answer four
                questions to see if you qualify for a free buyback review with a
                precious metals specialist.
              </p>
              <ul className={styles.checks}>
                {[
                  "See what your coins are worth today",
                  "Understand the markup you paid",
                  "Get your options, with no obligation",
                ].map((t) => (
                  <li key={t}>
                    <span className={styles.checkDot}>
                      <Icon name="check" size={14} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <ol className={styles.how}>
                <li>
                  <span>01</span>Answer four quick questions
                </li>
                <li>
                  <span>02</span>See if you qualify
                </li>
                <li>
                  <span>03</span>Get your free review
                </li>
              </ol>

              <button
                type="button"
                className={styles.primary}
                onClick={() => goTo({ kind: "question", index: 0 })}
              >
                Start the quiz <Icon name="arrow" size={16} />
              </button>
              <div className={styles.fineline}>
                <span>
                  <Icon name="shield" size={13} /> Private &amp; secure
                </span>
                <span>
                  <Icon name="clock" size={13} /> About 60 seconds
                </span>
              </div>
            </div>
          </div>
        )}

        {q && (
          <div className={styles.stage} key={q.id}>
            <div className={styles.progress}>
              <div className={styles.progressTop}>
                <button
                  type="button"
                  className={styles.back}
                  onClick={() =>
                    goTo(
                      questionIndex === 0
                        ? { kind: "intro" }
                        : { kind: "question", index: questionIndex - 1 },
                    )
                  }
                >
                  <Icon name="chevron" size={14} className={styles.backIcon} />
                  Back
                </button>
                <span className={styles.stepCount}>
                  Question <b>{questionIndex + 1}</b> of {QUESTION_COUNT}
                </span>
              </div>
              <div
                className={styles.track}
                role="progressbar"
                aria-label="Quiz progress"
                aria-valuenow={Math.round(pct)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <i style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className={styles.body}>
              <span className={styles.eyebrow}>{q.eyebrow}</span>
              <h1 className={styles.qTitle} id={`q-${q.id}`}>
                {q.title} <em>{q.titleEm}</em>
              </h1>
              <p className={styles.qHelper}>{q.helper}</p>

              <div
                className={styles.opts}
                role="radiogroup"
                aria-labelledby={`q-${q.id}`}
              >
                {q.options.map((o) => {
                  const isSel = selected === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="radio"
                      aria-checked={isSel}
                      className={`${styles.opt} ${q.amount ? styles.optAmount : ""} ${
                        isSel ? styles.optSel : ""
                      }`}
                      onClick={() => handleSelect(q.id, o.value, questionIndex)}
                    >
                      {o.icon && (
                        <span
                          className={`${styles.optIco} ${
                            o.accent ? styles.optIcoGold : ""
                          }`}
                        >
                          <OptionIcon icon={o.icon} />
                        </span>
                      )}
                      <span className={styles.optTxt}>
                        <span className={styles.optLabel}>{o.label}</span>
                        {o.detail && (
                          <span className={styles.optDetail}>{o.detail}</span>
                        )}
                      </span>
                      <span className={styles.radio} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className={styles.primary}
                disabled={!selected}
                onClick={() => goTo(nextAfterQuestion(questionIndex))}
              >
                {questionIndex + 1 === QUESTION_COUNT
                  ? "See my results"
                  : "Continue"}{" "}
                <Icon name="arrow" size={16} />
              </button>
            </div>
          </div>
        )}

        {stage.kind === "form" && (
          <form className={styles.stage} onSubmit={handleSubmit} noValidate>
            <div className={styles.body}>
              <span className={styles.qualifyBadge}>
                <span className={styles.qualifyTick} aria-hidden="true" />
                You qualify for a free review
              </span>
              <h1 className={styles.qTitle}>
                Good news. We found a <em>specialist match.</em>
              </h1>
              <p className={styles.qHelper}>
                A precious metals specialist can value your coins at today’s
                market price and walk you through your options.
              </p>

              {provider && (
                <div className={styles.matchCard}>
                  <ProviderLogo provider={provider} />
                  <div className={styles.matchText}>
                    <span className={styles.matchKicker}>
                      Your matched specialist
                    </span>
                    <strong>{provider.name}</strong>
                  </div>
                  <Link
                    className="sponsored-tag"
                    href="/advertising-disclosure"
                  >
                    Sponsored
                  </Link>
                </div>
              )}

              <div className={styles.summary}>
                <div className={styles.summaryHd}>
                  <span>Your answers</span>
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => goTo({ kind: "question", index: 0 })}
                  >
                    Edit
                  </button>
                </div>
                <dl className={styles.summaryGrid}>
                  {buybackSummary(answers).map((s) => (
                    <div key={s.id}>
                      <dt>{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className={styles.form}>
                <div className={styles.row}>
                  <label className={styles.field}>
                    <span>First name</span>
                    <input
                      name="firstName"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </label>
                  <label className={styles.field}>
                    <span>Last name</span>
                    <input
                      name="lastName"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <label className={styles.field}>
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span>Phone</span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="(555) 555-5555"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    required
                  />
                </label>
              </div>

              {error && (
                <div className={styles.error} role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className={styles.primary}
                disabled={submitting}
              >
                {submitting ? "Sending your request…" : "Get my free review"}
                {!submitting && <Icon name="arrow" size={16} />}
              </button>
              <p className={styles.consent}>
                By tapping “Get my free review,” you agree that Top Provider
                Picks and Citadel Gold may contact you by call, text or email at
                the number and email provided, including by automated means.
                Consent is not a condition of purchase. Msg &amp; data rates may
                apply. Reply STOP to opt out. See our{" "}
                <Link href="/privacy" target="_blank">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" target="_blank">
                  Terms
                </Link>
                .
              </p>
            </div>
          </form>
        )}

        {stage.kind === "done" && (
          <div className={styles.stage}>
            <div className={`${styles.hero} ${styles.heroConfirm}`}>
              <div className={styles.heroGrid} aria-hidden="true" />
              <div className={styles.heroGlowTeal} aria-hidden="true" />
              <div className={styles.seal} aria-hidden="true" />
              <span className={`${styles.eyebrow} ${styles.eyebrowGold}`}>
                Request received
              </span>
              <h1 className={styles.heroTitle}>
                You’re all set, <em>{stage.firstName}.</em>
              </h1>
            </div>
            <div className={styles.body}>
              <p className={styles.lede}>
                Your buyback review request is in. Here’s what to expect.
              </p>
              <div className={styles.next}>
                <div className={styles.nextHd}>What happens next</div>
                {[
                  [
                    `A ${provider?.name ?? "specialist"} specialist reaches out`,
                    "Usually within one business day, by phone.",
                  ],
                  [
                    "Your coins are valued",
                    "Coin by coin, at today’s market price.",
                  ],
                  [
                    "You decide, no pressure",
                    "Keep, sell or reposition. It’s your call.",
                  ],
                ].map(([t, d], i) => (
                  <div className={styles.nextStep} key={t}>
                    <span className={styles.nextNum}>{i + 1}</span>
                    <div>
                      <strong>{t}</strong>
                      <span>{d}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link className={styles.guide} href="/guides/gold-ira-fees">
                <span className={styles.guideIco}>
                  <Icon name="book" size={18} />
                </span>
                <span>
                  <span className={styles.guideKicker}>While you wait</span>
                  <strong>How gold markups and fees work</strong>
                </span>
                <Icon name="arrow" size={16} className={styles.guideArrow} />
              </Link>
              <p className={styles.fineline}>
                Tip: keep your purchase invoice or IRA statement handy.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
