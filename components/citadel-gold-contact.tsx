"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Provider } from "@/lib/catalog";
import { outboundRel } from "@/lib/commercial";
import { useComparison } from "./comparison-context";
import { CitadelGoldArtwork } from "./citadel-gold-artwork";
import { Icon } from "./icons";
import styles from "./citadel-gold.module.css";

const promptedKey = "tpp-citadel-contact-prompted";
const phone = "tel:+18006055597";

function Logo() {
  return (
    <Image
      src="/citadel/logo-dark.png"
      alt="Citadel Gold"
      width={1920}
      height={776}
      sizes="190px"
      className={styles.logo}
    />
  );
}

function PreferredBadge() {
  return (
    <span className={styles.preferred}>
      <span>#1</span> PREFERRED COMPANY
    </span>
  );
}

export function CitadelGoldContact({ provider }: { provider: Provider }) {
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const prompted = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const dock = useRef<HTMLElement>(null);
  const { selected } = useComparison();
  const hasShortlist = selected.length > 0;

  const rememberPrompt = useCallback(() => {
    prompted.current = true;
    try {
      sessionStorage.setItem(promptedKey, "1");
    } catch {}
  }, []);

  const showContact = useCallback(() => {
    rememberPrompt();
    setOpen(true);
  }, [rememberPrompt]);

  useEffect(() => {
    if (dismissed || hasShortlist) return;
    const mobile = window.matchMedia("(max-width: 767px)");
    let frame = 0;
    const checkPlacement = () => {
      frame = 0;
      if (!mobile.matches || prompted.current || window.scrollY < 30) return;
      try {
        if (sessionStorage.getItem(promptedKey)) return;
      } catch {}
      const placement = document.querySelector(
        "#citadel-gold .provider-description h2",
      );
      if (!placement) return;
      // Trigger when the #1 company's heading reaches the unobscured reading area.
      const bounds = placement.getBoundingClientRect();
      const dockHeight = dock.current?.getBoundingClientRect().height ?? 0;
      if (
        bounds.top >= 110 &&
        bounds.bottom <= window.innerHeight - dockHeight - 16
      ) {
        // Do not interrupt another native dialog or a navigation menu.
        if (document.querySelector("dialog[open], .mega-menu")) return;
        showContact();
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(checkPlacement);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [dismissed, hasShortlist, showContact]);

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      {!dismissed && !hasShortlist && (
        <>
          <div className={styles.dockSpace} aria-hidden="true" />
          <aside
            ref={dock}
            className={styles.dock}
            aria-label="Citadel Gold preferred company"
          >
            <button
              className={styles.dismissDock}
              aria-label="Dismiss Citadel Gold footer"
              onClick={() => {
                rememberPrompt();
                setDismissed(true);
              }}
            >
              <Icon name="close" size={17} />
            </button>
            <div className={styles.dockBrand}>
              <Logo />
            </div>
            <div className={styles.dockMessage}>
              <PreferredBadge />
              <p>A more personal approach to gold &amp; silver IRAs.</p>
              <Link
                href="/advertising-disclosure"
                className={styles.disclosure}
              >
                Sponsored placement
              </Link>
            </div>
            <div className={styles.dockActions}>
              <a href={phone} className={styles.callButton}>
                <Icon name="phone" size={18} />
                <span>
                  Call now
                  <span className={styles.desktopPhone}>800-605-5597</span>
                </span>
              </a>
              <button className={styles.primaryButton} onClick={showContact}>
                Learn more <Icon name="arrow" size={20} />
              </button>
              <span className={styles.dockCaption}>
                Connect with Citadel Gold
              </span>
            </div>
          </aside>
        </>
      )}
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="citadel-contact-title"
        aria-describedby="citadel-contact-description"
        onCancel={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls =
            event.currentTarget.querySelectorAll<HTMLElement>(
              "a[href], button",
            );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        {open && (
          <div className={styles.modalLayout}>
            <button
              className={styles.closeModal}
              aria-label="Close Citadel Gold contact"
              onClick={() => setOpen(false)}
              autoFocus
            >
              <Icon name="close" size={22} />
            </button>
            <CitadelGoldArtwork />
            <div className={styles.modalContent}>
              <div className={styles.modalBrand}>
                <Logo />
                <span className={styles.rankSeal}>
                  #1<span>PLACEMENT</span>
                </span>
              </div>
              <Link
                href="/advertising-disclosure"
                className={styles.disclosure}
              >
                Preferred company · Sponsored placement
              </Link>
              <h2 id="citadel-contact-title">
                Your next chapter.
                <br />
                <em>Backed by gold.</em>
              </h2>
              <p
                id="citadel-contact-description"
                className={styles.modalDescription}
              >
                Explore a gold &amp; silver IRA with personal guidance from a
                Citadel Gold specialist.
              </p>
              <ul className={styles.benefits}>
                <li>
                  <Icon name="check" size={16} />
                  Guidance through an IRA rollover
                </li>
                <li>
                  <Icon name="check" size={16} />
                  Physical gold &amp; silver options
                </li>
              </ul>
              <div className={styles.modalActions}>
                <a href={phone} className={styles.callButton}>
                  <Icon name="phone" size={19} />
                  Call now <span>800-605-5597</span>
                </a>
                <a
                  href={provider.domain}
                  target="_blank"
                  rel={outboundRel(provider.id)}
                  className={styles.primaryButton}
                >
                  Learn more <Icon name="arrow" size={21} />
                </a>
              </div>
              <p className={styles.websiteCaption}>
                On Citadel Gold’s website <Icon name="external" size={11} />
              </p>
              <p className={styles.finePrint}>
                IRA minimum: $25,000, per company. Confirm current pricing,
                fees, and eligibility with Citadel Gold.
              </p>
              <button
                className={styles.keepComparing}
                onClick={() => setOpen(false)}
              >
                Continue comparing companies <Icon name="arrow" size={14} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
