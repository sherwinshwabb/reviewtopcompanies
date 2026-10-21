"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import Link from "next/link";
import { providers, providerById } from "@/lib/catalog";
import { Icon } from "./icons";
import { usePathname } from "next/navigation";
import { useBrowserValue } from "@/lib/browser-store";
type Context = {
  selected: string[];
  toggle: (id: string) => void;
  clear: () => void;
  message: string;
};
const ComparisonContext = createContext<Context>({
  selected: [],
  toggle: () => {},
  clear: () => {},
  message: "",
});
export const useComparison = () => useContext(ComparisonContext);
export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useBrowserValue("tpp-comparison", "[]");
  const [message, setMessage] = useState("");
  const path = usePathname();
  let selected: string[] = [];
  try {
    const stored: unknown = JSON.parse(raw);
    if (Array.isArray(stored)) {
      selected = [
        ...new Set(
          stored.filter(
            (id: unknown): id is string =>
              typeof id === "string" && providers.some((p) => p.id === id),
          ),
        ),
      ].slice(0, 3);
      if (selected.length)
        selected = selected.filter(
          (id) =>
            providerById(id)?.category === providerById(selected[0])?.category,
        );
    }
  } catch {}
  const setSelected = (next: string[]) => setRaw(JSON.stringify(next));
  function toggle(id: string) {
    setMessage("");
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
      return;
    }
    if (selected.length === 3) {
      setMessage("Three is the limit. Remove one to add another.");
      return;
    }
    const provider = providerById(id);
    if (
      selected.length &&
      providerById(selected[0])?.category !== provider?.category
    ) {
      setMessage(
        "Shortlists are one category at a time. Clear it to compare a different category.",
      );
      return;
    }
    setSelected([...selected, id]);
  }
  const clear = () => {
    setSelected([]);
    setMessage("");
  };
  return (
    <ComparisonContext.Provider value={{ selected, toggle, clear, message }}>
      {children}
      <div className="sr-only" aria-live="polite">
        {selected.length} companies selected. {message}
      </div>
      {selected.length > 0 && path !== "/compare" && (
        <aside className="comparison-tray" aria-label="Your comparison">
          <div className="tray-label">
            <Icon name="compare" />
            <div>
              <strong>Your shortlist</strong>
              <span>{selected.length} of 3</span>
            </div>
          </div>
          <div className="tray-names">
            {selected.map((id) => (
              <button
                key={id}
                onClick={() => toggle(id)}
                aria-label={`Remove ${providerById(id)?.name}`}
              >
                {providerById(id)?.name}
                <Icon name="close" size={14} />
              </button>
            ))}
          </div>
          <Link className="button" href="/compare">
            Compare <Icon name="arrow" size={17} />
          </Link>
          <button className="text-button" onClick={clear}>
            Clear
          </button>
          {message && (
            <p role="status" className="tray-message">
              {message}
            </p>
          )}
        </aside>
      )}
    </ComparisonContext.Provider>
  );
}
export function CompareButton({ id }: { id: string }) {
  const { selected, toggle } = useComparison();
  return (
    <button
      className={`compare-toggle ${selected.includes(id) ? "selected" : ""}`}
      onClick={() => toggle(id)}
      aria-pressed={selected.includes(id)}
    >
      <span className="checkbox">
        {selected.includes(id) && <Icon name="check" size={12} />}
      </span>
      {selected.includes(id) ? "On your list" : "Add to compare"}
    </button>
  );
}
