import type { CSSProperties } from "react";
const paths: Record<string, React.ReactNode> = {
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  gold: (
    <>
      <path d="m7 13-3 7h16l-3-7ZM9 4l-3 6h12l-3-6Z" />
      <path d="M9 16h6M10 7h4" />
    </>
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8" />
    </>
  ),
  scales: (
    <>
      <path d="M12 3v18M7 21h10M4 6h16M5 6l-3 8h6ZM19 6l-3 8h6Z" />
      <path d="M2 14a3 3 0 0 0 6 0M16 14a3 3 0 0 0 6 0" />
    </>
  ),
  graduate: (
    <>
      <path d="m2 8 10-5 10 5-10 5ZM6 10v7c4 3 8 3 12 0v-7M22 8v8" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4M13 15h2" />
    </>
  ),
  bank: (
    <>
      <path d="m2 8 10-5 10 5ZM3 21h18M5 11v7M10 11v7M15 11v7M20 11v7" />
    </>
  ),
  car: (
    <>
      <path d="m4 10 2-6h12l2 6M3 10h18v8H3ZM5 18v3M19 18v3M3 14h4M17 14h4" />
    </>
  ),
  sunrise: (
    <>
      <path d="M2 19h20M5 15a7 7 0 0 1 14 0M12 2v3M3 6l2 2M21 6l-2 2M1 12h3M20 12h3" />
      <path d="m9 14 3-3 3 3M12 11v8" />
    </>
  ),
  shield: (
    <>
      <path d="m12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5Z" />
      <path d="m8 11 3 3 5-6" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18M7 16v-4M12 16V9M17 16V5" />
      <path d="m6 8 5-4 4 1 5-3" />
    </>
  ),
  book: (
    <>
      <path d="M12 5v16M12 5C8 2 4 3 2 4v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-2-1-6-2-10 1Z" />
    </>
  ),
  compare: (
    <>
      <path d="M4 5h6v14H4zM14 5h6v14h-6zM6 9h2M6 12h2M16 9h2M16 12h2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  external: (
    <>
      <path d="M14 3h7v7M21 3 10 14M10 3H3v18h18v-7" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  star: (
    <path d="m12 2 3 6.5 7 .8-5.2 5 1.4 7-6.2-3.5-6.2 3.5 1.4-7-5.2-5 7-.8Z" />
  ),
};
export function Icon({
  name,
  size = 24,
  className = "",
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {paths[name] || paths.book}
    </svg>
  );
}
export function Brand({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <span className={`brand ${light ? "brand-light" : ""}`}>
      <svg
        width="40"
        height="42"
        viewBox="0 0 40 42"
        fill="none"
        aria-hidden="true"
      >
        <path d="M4 33V13l9-5v25z" fill="currentColor" opacity=".5" />
        <path d="M15 33V8l9-5v30z" fill="currentColor" />
        <path d="M26 33V15l9-5v23z" fill="#176B79" />
        <path
          d="m5 39 15-3 15 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span>
          top <b>provider picks</b>
        </span>
      )}
    </span>
  );
}
