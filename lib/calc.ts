/**
 * Ядро расчёта CS2-фермы.
 * Всё считается вокруг аккаунтов, стартового бюджета, дохода и окупаемости.
 * Никаких сторонних панелей, софта или курса доллара.
 */

export const CALC_LIMITS = {
  min: 10,
  max: 300,
  step: 5,
} as const;

export type FarmResult = {
  accountsCount: number;
  accountPrice: number;
  scaleBonus: number;
  startBudget: number;
  /** Ориентир по дропу в месяц, нижняя граница (≈70 ₽/нед на аккаунт). */
  monthlyIncomeMin: number;
  /** Ориентир по дропу в месяц, верхняя граница (≈100 ₽/нед на аккаунт). */
  monthlyIncomeMax: number;
  /** Средний сценарий — середина диапазона (честный ориентир). */
  monthlyIncomeBase: number;
  /** Окупаемость по среднему сценарию, месяцев. */
  paybackMonthsBase: number;
  /** Быстрый край окупаемости. */
  paybackMonthsMin: number;
  /** Медленный край окупаемости. */
  paybackMonthsMax: number;
  /** Ориентир чистой прибыли за 12 мес после окупаемости старта. */
  yearlyProfitBase: number;
  /** Доход на один аккаунт в месяц (средний сценарий) — растёт с объёмом. */
  incomePerAccount: number;
  /** Насколько быстрее окупаемость относительно минимального старта (10 акк), %. */
  paybackImprovementPct: number;
  /** Текущий тариф и следующий выгодный порог (для подсказки масштаба). */
  tier: "start" | "mid" | "scale";
  nextTierAt: number | null;
  nextTierPrice: number | null;
};

export function accountPriceFor(accountsCount: number): number {
  if (accountsCount >= 100) return 1500;
  if (accountsCount >= 30) return 1550;
  return 1600;
}

/**
 * Плавный коэффициент масштаба: чем больше аккаунтов, тем выше шанс поймать
 * дорогой дроп и тем выше средний доход на аккаунт. Растёт непрерывно от 1.00
 * (10 акк) до 1.20 (300 акк), поэтому окупаемость улучшается с каждым шагом,
 * а не только на порогах цены.
 */
export function scaleBonusFor(accountsCount: number): number {
  const c = clampCount(accountsCount);
  const t = (c - CALC_LIMITS.min) / (CALC_LIMITS.max - CALC_LIMITS.min); // 0..1
  return 1 + 0.2 * t;
}

function tierFor(accountsCount: number): FarmResult["tier"] {
  if (accountsCount >= 100) return "scale";
  if (accountsCount >= 30) return "mid";
  return "start";
}

/**
 * Главная функция расчёта.
 *
 * Доход на аккаунт: ~70–100 ₽/нед → ×4 недели.
 * Средний сценарий — середина диапазона (≈85 ₽/нед), чтобы цифра была честной,
 * а не совпадала с верхней границей.
 */
export function calcFarm(rawCount: number): FarmResult {
  const accountsCount = clampCount(rawCount);
  const accountPrice = accountPriceFor(accountsCount);
  const scaleBonus = scaleBonusFor(accountsCount);

  const startBudget = Math.round(accountsCount * accountPrice);

  const monthlyIncomeMin = Math.round(accountsCount * 70 * 4 * scaleBonus);
  const monthlyIncomeMax = Math.round(accountsCount * 100 * 4 * scaleBonus);
  const monthlyIncomeBase = Math.round(accountsCount * 85 * 4 * scaleBonus);

  const paybackMonthsBase = round1(startBudget / monthlyIncomeBase);
  const paybackMonthsMin = round1(startBudget / monthlyIncomeMax);
  const paybackMonthsMax = round1(startBudget / monthlyIncomeMin);

  const yearlyProfitBase = Math.round(monthlyIncomeBase * 12 - startBudget);
  const incomePerAccount = Math.round(monthlyIncomeBase / accountsCount);

  // Сравнение с минимальным стартом (10 акк) — насколько быстрее окупаемость.
  const baselinePayback = 1600 / (85 * 4 * scaleBonusFor(CALC_LIMITS.min));
  const currentPayback = accountPrice / (85 * 4 * scaleBonus);
  const paybackImprovementPct = Math.max(
    0,
    Math.round((1 - currentPayback / baselinePayback) * 100)
  );

  const tier = tierFor(accountsCount);
  const nextTierAt = tier === "start" ? 30 : tier === "mid" ? 100 : null;
  const nextTierPrice = tier === "start" ? 1550 : tier === "mid" ? 1500 : null;

  return {
    accountsCount,
    accountPrice,
    scaleBonus,
    startBudget,
    monthlyIncomeMin,
    monthlyIncomeMax,
    monthlyIncomeBase,
    paybackMonthsBase,
    paybackMonthsMin,
    paybackMonthsMax,
    yearlyProfitBase,
    incomePerAccount,
    paybackImprovementPct,
    tier,
    nextTierAt,
    nextTierPrice,
  };
}

/**
 * Обратный расчёт: максимум аккаунтов под заданный бюджет (в рублях).
 * Цена за аккаунт зависит от объёма, а на пороге 100 старт даже дешевле,
 * поэтому надёжнее перебрать допустимые значения сверху вниз.
 */
export function maxAccountsForBudget(budget: number): { count: number; enough: boolean } {
  const { min, max, step } = CALC_LIMITS;
  if (!Number.isFinite(budget) || budget <= 0) {
    return { count: min, enough: false };
  }
  for (let c = max; c >= min; c -= step) {
    if (c * accountPriceFor(c) <= budget) {
      return { count: c, enough: true };
    }
  }
  // Бюджета не хватает даже на минимум — показываем минимум, но помечаем нехватку.
  return { count: min, enough: false };
}

export function clampCount(value: number): number {
  const { min, max, step } = CALC_LIMITS;
  if (Number.isNaN(value)) return min;
  const snapped = Math.round(value / step) * step;
  return Math.min(max, Math.max(min, snapped));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Формат денег: 16 000 ₽ (узкий неразрывный пробел как разделитель тысяч). */
export function formatRub(value: number): string {
  return `${Math.round(value).toLocaleString("ru-RU").replace(/\u00A0/g, "\u202F")}\u202F₽`;
}

/** Только число без символа валюты (для анимированных счётчиков). */
export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("ru-RU").replace(/\u00A0/g, "\u202F");
}

export function formatMonths(value: number): string {
  const v = (Math.round(value * 10) / 10).toLocaleString("ru-RU");
  return `${v} мес`;
}
