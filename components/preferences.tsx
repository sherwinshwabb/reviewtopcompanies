"use client";
import { useState } from "react";
import { useBrowserValue, useGlobalPrivacyControl } from "@/lib/browser-store";
export function PrivacyPreferences() {
  const [stored, setStored] = useBrowserValue(
    "tpp-analytics-preference",
    "denied",
  );
  const [choice, setChoice] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const gpc = useGlobalPrivacyControl();
  const analytics = choice ?? stored === "allowed";
  function setAnalytics(next: boolean) {
    setChoice(next);
  }
  function save() {
    setStored(analytics && !gpc ? "allowed" : "denied");
    setSaved(true);
  }
  return (
    <div className="preferences">
      <div>
        <span>
          <strong>Essential browser storage</strong>
          <small>
            Keeps your comparison shortlist and this privacy setting.
          </small>
        </span>
        <span>Always on</span>
      </div>
      <div>
        <label htmlFor="analytics">
          <strong>Optional analytics</strong>
          <small>Nothing is connected right now.</small>
        </label>
        <input
          id="analytics"
          type="checkbox"
          checked={analytics && !gpc}
          disabled={gpc}
          onChange={(e) => {
            setAnalytics(e.target.checked);
            setSaved(false);
          }}
        />
      </div>
      {gpc && (
        <p>
          Your browser is sending the Global Privacy Control signal, so optional
          tracking stays off.
        </p>
      )}
      <button className="button" onClick={save}>
        Save
      </button>
      {saved && <p role="status">Saved in this browser.</p>}
    </div>
  );
}
export function MessageDraft({ correction = false }: { correction?: boolean }) {
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState("");
  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setText(
          `${correction ? "Correction request" : "Question"}\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nPage: ${data.get("page") || "General"}\n\n${data.get("message")}`,
        );
        setReady(true);
        setCopied(false);
      }}
    >
      <p>
        This builds a message you can copy or download. Nothing gets sent to us
        or to any company.
      </p>
      <div className="form-row">
        <label>
          Your name
          <input name="name" required maxLength={100} />
        </label>
        <label>
          Email
          <input name="email" type="email" required maxLength={254} />
        </label>
      </div>
      <label>
        Page or company it&rsquo;s about
        <input
          name="page"
          placeholder="Company name or page link"
          maxLength={500}
        />
      </label>
      <label>
        {correction ? "What's wrong?" : "What can we help with?"}
        <textarea
          name="message"
          required
          rows={5}
          minLength={10}
          maxLength={5000}
          placeholder={
            correction
              ? "Tell us what's incorrect and where we can check it."
              : "Type your message."
          }
        />
      </label>
      <button className="button" type="submit">
        Build the {correction ? "correction" : "message"}
      </button>
      {ready && (
        <div className="message-preview" role="status">
          <h3>Your draft</h3>
          <pre>{text}</pre>
          <div className="button-row">
            <button
              className="button"
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(text);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              className="button button-outline"
              onClick={() => {
                const url = URL.createObjectURL(
                  new Blob([text], { type: "text/plain" }),
                );
                const a = document.createElement("a");
                a.href = url;
                a.download = correction
                  ? "tpp-correction.txt"
                  : "tpp-inquiry.txt";
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              }}
            >
              Download
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
