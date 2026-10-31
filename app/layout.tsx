import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import IntroLoader from "@/components/IntroLoader";

const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "500"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const description = "A beachfront retreat of eighteen villas, set between palms and open water. Concept demo.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Terrantia | Beachfront Resort", template: "%s | Terrantia" },
  description,
  applicationName: "Terrantia",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Terrantia",
    title: "Terrantia | Beachfront Resort",
    description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terrantia | Beachfront Resort",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f6b73",
};

// Adds .js, and .intro-seen when the intro must not run (seen, reduced motion, not home).
const INIT_SCRIPT =
  "(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('terrantia-intro')||window.matchMedia('(prefers-reduced-motion: reduce)').matches||location.pathname!=='/'){d.classList.add('intro-seen')}}catch(e){d.classList.add('intro-seen')}})();";

// Resort structured data. Address and telephone are intentionally omitted:
// the real details are pending and must not be invented.
const resortJsonLd = {
  "@context": "https://schema.org",
  "@type": "Resort",
  name: "Terrantia",
  description,
  image: `${siteUrl}/opengraph-image`,
  url: siteUrl,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(resortJsonLd).replace(/</g, "\u003c") }}
        />
      </head>
      <body>
        <SmoothScroll>
          <PageTransition>{children}</PageTransition>
        </SmoothScroll>
        <IntroLoader />
      </body>
    </html>
  );
}
