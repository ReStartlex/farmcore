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

/** Стаж на FunPay в годах — считается от текущего года, чтобы не устаревать. */
export function funpayYears(): number {
  return new Date().getFullYear() - site.funpay.sinceYear;
}

/** Корректное склонение: 1 год / 2 года / 8 лет. */
export function yearsWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "год";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "года";
  return "лет";
}
