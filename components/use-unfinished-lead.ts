"use client";

import { useEffect, useRef } from "react";

type ContactLike = { email?: string; phone?: string };

export function hasUsableContact({ email, phone }: ContactLike) {
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email ?? "").trim());
  const validPhone = (phone ?? "").replace(/\D/g, "").length >= 10;
  return validEmail || validPhone;
}

/**
 * Captures forms that are abandoned on the contact step. When the visitor
 * hides the tab or leaves the page while `active`, the current form state is
 * sent to `endpoint` with `partial: true`, so the API files it in the CRM as
 * an UNFINISHED lead. Only sends when there is a usable email or phone number,
 * and never sends the same details twice.
 */
export function useUnfinishedLeadBeacon(
  endpoint: string,
  active: boolean,
  buildPayload: () => (Record<string, unknown> & ContactLike) | null,
) {
  const build = useRef(buildPayload);
  const isActive = useRef(active);
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    build.current = buildPayload;
    isActive.current = active;
  });

  useEffect(() => {
    function flush() {
      if (!isActive.current) return;
      const payload = build.current();
      if (!payload || !hasUsableContact(payload)) return;

      const body = JSON.stringify({ ...payload, partial: true });
      if (body === lastSent.current) return;
      lastSent.current = body;

      const blob = new Blob([body], { type: "application/json" });
      if (!navigator.sendBeacon?.(endpoint, blob)) {
        void fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") flush();
    }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, [endpoint]);
}
