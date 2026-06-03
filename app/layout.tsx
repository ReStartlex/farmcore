import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { faqJsonLd, personJsonLd, serviceJsonLd } from "@/lib/seo";
import { Analytics } from "@/components/Analytics";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: "CS2 ферма под ключ 2026 — расчёт, аккаунты и окупаемость | Steam ферма",
  description: site.description,
  keywords: [
    "ферма cs2",
    "ферма кс2",
    "ферма стим",
    "ферма под ключ",
    "steam ферма под ключ",
    "cs2 ферма под ключ",
    "купить ферму cs2",
    "ферма cs2 2026",
    "ферма кс2 2026",
    "ферма cs2 окупаемость",
    "заработок на дропе cs2",
    "аккаунты для фермы cs2",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: site.domain,
    siteName: site.brand,
    title: "CS2 ферма под ключ — расчёт, аккаунты и окупаемость",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "CS2 ферма под ключ — расчёт, аккаунты и окупаемость",
    description: site.description,
  },
  robots: { index: true, follow: true },
  verification: process.env.YANDEX_VERIFICATION
    ? { yandex: process.env.YANDEX_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#F6F7FB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = [serviceJsonLd(), faqJsonLd(), personJsonLd()];
  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable}`}>
      <body className="font-sans">
        <ScrollProgress />
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
