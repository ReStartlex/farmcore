import { site } from "@/data/site";
import { faq, type FaqItem } from "@/data/faq";

/**
 * FAQPage-разметка. Отдаётся ТОЛЬКО на страницах, где FAQ виден пользователю
 * (главная и лендинги) — иначе это нарушение требований к структурированным данным.
 * Можно передать свой набор вопросов (для уникального FAQ на лендингах).
 */
export function faqJsonLd(items: FaqItem[] = faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand,
    url: site.domain,
    description: site.description,
    sameAs: [site.telegram.url, site.funpay.url],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: site.telegram.url,
      availableLanguage: ["ru"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.brand,
    url: site.domain,
    inLanguage: "ru-RU",
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${site.brand} — ${site.tagline}`,
    serviceType: "CS2 / Steam фермы под ключ",
    description: site.description,
    areaServed: "RU",
    provider: {
      "@type": "Organization",
      name: site.brand,
      url: site.domain,
      sameAs: [site.telegram.url],
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "RUB",
      lowPrice: 1500,
      highPrice: 1600,
      offerCount: 3,
      unitText: "за аккаунт",
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Эксперт FARMCORE",
    description: `Специалист по Steam и CS2 с ${site.expSince} года. Помогает запускать фермы под ключ.`,
    sameAs: [site.telegram.url],
    knowsAbout: ["CS2", "Steam", "дроп предметов", "фермы аккаунтов"],
  };
}
