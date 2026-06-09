import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { organizationJsonLd, personJsonLd, serviceJsonLd, websiteJsonLd } from "@/lib/seo";
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
  title: "Ферма CS2 / Steam под ключ — расчёт и окупаемость",
  description: site.description,
  keywords: [
    "ферма cs2",
    "ферма кс2",
    "ферма стим",
    "ферма под ключ",
    "ферма кс2 под ключ",
    "steam ферма под ключ",
    "cs2 ферма под ключ",
    "купить ферму cs2",
    "купить ферму кс2",
    "готовая ферма cs2",
    "ферма cs2 цена",
    "ферма cs2 2026",
    "ферма кс2 2026",
    "ферма cs2 окупаемость",
    "заработок на дропе cs2",
    "заработок на ферме кс2",
    "аккаунты для фермы cs2",
    "аккаунты для фермы кс2",
    "фарм cs2",
    "фарм кс2",
    "фарм кейсов cs2",
    "ферма csgo",
    "ферма ксго",
    "ферма аккаунтов cs2",
    "ферма аккаунтов кс2",
    "ферма стим аккаунтов",
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
  verification: buildVerification(),
};

function buildVerification(): Metadata["verification"] | undefined {
  const v: { yandex?: string; google?: string } = {};
  if (process.env.YANDEX_VERIFICATION) v.yandex = process.env.YANDEX_VERIFICATION;
  if (process.env.GOOGLE_VERIFICATION) v.google = process.env.GOOGLE_VERIFICATION;
  return Object.keys(v).length ? v : undefined;
}

export const viewport: Viewport = {
  themeColor: "#F6F7FB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Сайтовая разметка бренда. FAQPage сюда НЕ кладём — её отдаёт только
  // секция FAQ на страницах, где вопросы реально видны.
  const jsonLd = [serviceJsonLd(), personJsonLd(), organizationJsonLd(), websiteJsonLd()];
  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable}`}>
      <head>
        {/* Ускоряем подключение к Яндекс.Метрике (раньше начинается TLS-хендшейк). */}
        <link rel="preconnect" href="https://mc.yandex.ru" crossOrigin="" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        {/* Без JS контент с анимацией появления остаётся видимым (надёжно для медленных сетей и краулеров). */}
        <noscript>
          <style>{`.reveal-anim{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
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
