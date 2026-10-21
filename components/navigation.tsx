"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/catalog";
import { siteName } from "@/lib/site";
import { Brand, Icon } from "./icons";
export function Header() {
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setMenu(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", key);
    };
  }, []);
  return (
    <>
      <div className="top-strip">
        <div className="container">
          <span>Compare companies across ten categories.</span>
          <Link href="/methodology">
            How we compare <Icon name="arrow" size={13} />
          </Link>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner" ref={navRef}>
          <Link href="/" aria-label={`${siteName} home`}>
            <Brand />
          </Link>
          <nav aria-label="Main navigation" className="desktop-nav">
            <button
              className={menu ? "nav-link active" : "nav-link"}
              aria-expanded={menu}
              aria-controls="category-menu"
              onClick={() => setMenu(!menu)}
            >
              Categories <Icon name="chevron" size={14} />
            </button>
            <Link
              className={pathname === "/companies" ? "active" : ""}
              href="/companies"
            >
              Company reviews
            </Link>
            <Link href="/methodology">How we review</Link>
            <Link href="/guides">Guides</Link>
          </nav>
          <div className="header-actions">
            <Link href="/search" className="icon-button" aria-label="Search">
              <Icon name="search" size={21} />
            </Link>
            <Link className="button small compare-header" href="/compare">
              <Icon name="compare" size={17} /> Compare
            </Link>
            <button
              className="icon-button mobile-menu"
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <Icon name={menu ? "close" : "menu"} />
            </button>
          </div>
          {menu && (
            <div className="mega-menu" id="category-menu">
              <div className="menu-intro">
                <span className="eyebrow">Where to start</span>
                <h3>
                  What are you
                  <br />
                  deciding?
                </h3>
                <Link href="/categories" onClick={() => setMenu(false)}>
                  All ten categories <Icon name="arrow" size={16} />
                </Link>
              </div>
              <div className="menu-categories">
                {categories.map((c) => (
                  <Link key={c.id} href={c.path} onClick={() => setMenu(false)}>
                    <Icon name={c.icon} size={19} />
                    {c.title}
                  </Link>
                ))}
              </div>
              <div className="mobile-extra">
                <Link href="/companies" onClick={() => setMenu(false)}>
                  Company reviews
                </Link>
                <Link href="/methodology" onClick={() => setMenu(false)}>
                  How we review
                </Link>
                <Link href="/guides" onClick={() => setMenu(false)}>
                  Guides
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/">
              <Brand light />
            </Link>
            <p>
              Clear company reviews.
              <br />
              No sales pitch.
            </p>
            <span>Side-by-side comparisons across ten categories.</span>
          </div>
          <div>
            <h4>Browse</h4>
            <Link href="/categories">All categories</Link>
            <Link href="/companies">Company reviews</Link>
            <Link href="/compare">Compare companies</Link>
            <Link href="/guides">Guides</Link>
          </div>
          <div>
            <h4>About the site</h4>
            <Link href="/about">About us</Link>
            <Link href="/methodology">How we review</Link>
            <Link href="/editorial-policy">Editorial policy</Link>
            <Link href="/corrections">Send a correction</Link>
          </div>
          <div>
            <h4>Reach us</h4>
            <Link href="/contact">Contact</Link>
            <Link href="/advertise">Work with us</Link>
            <Link href="/ownership">Ownership</Link>
            <Link href="/accessibility">Accessibility</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 {siteName}</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/advertising-disclosure">Advertising disclosure</Link>
            <Link href="/privacy-choices">Privacy choices</Link>
          </div>
          <span className="footer-signoff">Read the fine print.</span>
        </div>
      </div>
    </footer>
  );
}
