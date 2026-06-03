export type Scenario = {
  id: "start" | "optimal" | "scale";
  name: string;
  range: string;
  /** Пресет для калькулятора при клике «рассчитать этот сценарий». */
  preset: number;
  pricePerAccount: number;
  popular?: boolean;
  who: string;
  perks: string[];
};

export const scenarios: Scenario[] = [
  {
    id: "start",
    name: "Стартовый",
    range: "10–25 аккаунтов",
    preset: 15,
    pricePerAccount: 1600,
    who: "Чтобы попробовать нишу с минимальным бюджетом и понять механику на практике.",
    perks: [
      "Минимальный порог входа",
      "Быстрый старт за пару дней",
      "Подходит для первого опыта",
    ],
  },
  {
    id: "optimal",
    name: "Оптимальный",
    range: "30–75 аккаунтов",
    preset: 50,
    pricePerAccount: 1550,
    popular: true,
    who: "Баланс цены за аккаунт и стабильности дропа. Самый частый выбор.",
    perks: [
      "Цена аккаунта ниже — 1550 ₽",
      "Стабильнее поток дропа",
      "Окупаемость быстрее, чем на старте",
    ],
  },
  {
    id: "scale",
    name: "Масштабный",
    range: "100+ аккаунтов",
    preset: 100,
    pricePerAccount: 1500,
    who: "Лучшая цена за аккаунт и максимум попыток поймать дорогой дроп.",
    perks: [
      "Лучшая цена — 1500 ₽/акк",
      "Максимум попыток на дроп",
      "Самая быстрая окупаемость",
    ],
  },
];
