import Link from "next/link";
import { Icon } from "@/components/icons";
export default function NotFound() {
  return (
    <main id="main-content" className="container not-found">
      <span className="eyebrow">404 · WRONG TURN</span>
      <h1>
        That page
        <br />
        <em>isn&rsquo;t here.</em>
      </h1>
      <p>The link may be old or mistyped. The categories are one click away.</p>
      <Link className="button" href="/categories">
        Browse the categories
        <Icon name="arrow" size={18} />
      </Link>
    </main>
  );
}
