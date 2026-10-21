"use client";
import { useSyncExternalStore } from "react";
const fallback = new Map<string, string>();
const eventName = "tpp-storage-change";
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(eventName, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(eventName, onChange);
  };
}
export function useBrowserValue(key: string, initial: string) {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key) ?? fallback.get(key) ?? initial;
      } catch {
        return fallback.get(key) ?? initial;
      }
    },
    () => initial,
  );
  function setValue(next: string) {
    fallback.set(key, next);
    try {
      localStorage.setItem(key, next);
    } catch {}
    window.dispatchEvent(new Event(eventName));
  }
  return [value, setValue] as const;
}
export function useGlobalPrivacyControl() {
  return useSyncExternalStore(
    subscribe,
    () =>
      (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl === true,
    () => false,
  );
}

const subscribeHydration = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
}
