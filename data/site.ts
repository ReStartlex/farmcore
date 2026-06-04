/**
 * Единый конфиг бренда. Меняется в одном месте — имя, контакты, тексты.
 */

export const site = {
  brand: "FARMCORE",
  tagline: "фермы CS2 / Steam под ключ",
  domain: "https://farmcore.ru",
  description:
    "Купить ферму CS2 под ключ: расчёт стартового бюджета и окупаемости, аккаунты для фермы Steam, помощь с запуском. Опыт в Steam с 2014 года.",
  telegram: {
    handle: "@assistent_cs",
    url: "https://t.me/assistent_cs",
  },
  // Проверяемая репутация продавца — главный аргумент доверия.
  funpay: {
    url: "https://funpay.com/users/617001/",
    reviews: "1000+",
    rating: "5.0",
    sinceYear: 2018,
    years: 8,
  },
  // Если оставят телефон — менеджер свяжется по нему; tg необязателен.
  expSince: 2014,
  nav: [
    { label: "Калькулятор", href: "#calculator" },
    { label: "Сценарии", href: "#scenarios" },
    { label: "Как проходит", href: "#process" },
    { label: "О проекте", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ],
} as const;

/** Telegram deep-link с предзаполненным сообщением расчёта. */
export function telegramLink(message?: string): string {
  if (!message) return site.telegram.url;
  return `${site.telegram.url}?text=${encodeURIComponent(message)}`;
}
