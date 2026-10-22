import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { Header, Footer } from "@/components/navigation";
import { ComparisonProvider } from "@/components/comparison-context";
import "./globals.css";
import { StructuredData } from "@/components/structured-data";
import { siteName, siteOrigin, siteDescription, siteTagline } from "@/lib/site";
import { organizationSchema, websiteSchema, staticSeo } from "@/lib/seo";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f5ef",
};
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  applicationName: siteName,
  title: {
    default: staticSeo["/"].title,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "company reviews",
    "compare companies",
    "best gold IRA companies",
    "best mortgage lenders",
    "best credit cards",
    "best banks",
    "student loan refinance",
    "debt relief companies",
    "credit repair companies",
    "investment companies",
    "personal injury lawyers",
    "lemon law lawyers",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    siteName,
    type: "website",
    locale: "en_US",
    url: "/",
    title: staticSeo["/"].title,
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteName}: ${siteTagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: staticSeo["/"].title,
    description: siteDescription,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/brand/mark.svg", type: "image/svg+xml" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${serif.variable}`}
    >
      <body>
        <StructuredData data={organizationSchema()} />
        <StructuredData data={websiteSchema()} />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <ComparisonProvider>
          <Header />
          {children}
          <Footer />
        </ComparisonProvider>
      </body>
    </html>
  );
}
