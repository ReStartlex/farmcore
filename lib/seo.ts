import { site } from "@/data/site";
import { faq } from "@/data/faq";

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
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
