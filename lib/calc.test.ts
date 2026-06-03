import { test } from "node:test";
import assert from "node:assert/strict";
import { calcFarm, accountPriceFor, scaleBonusFor, maxAccountsForBudget } from "./calc";

test("цена за аккаунт по tier-логике", () => {
  assert.equal(accountPriceFor(10), 1600);
  assert.equal(accountPriceFor(29), 1600);
  assert.equal(accountPriceFor(30), 1550);
  assert.equal(accountPriceFor(99), 1550);
  assert.equal(accountPriceFor(100), 1500);
  assert.equal(accountPriceFor(300), 1500);
});

test("коэффициент масштаба растёт плавно от 1.00 до 1.20", () => {
  assert.equal(scaleBonusFor(10), 1.0);
  assert.equal(Math.round(scaleBonusFor(300) * 100) / 100, 1.2);
  assert.ok(scaleBonusFor(50) > scaleBonusFor(30));
  assert.ok(scaleBonusFor(100) > scaleBonusFor(50));
  assert.ok(scaleBonusFor(200) > scaleBonusFor(100));
});

test("10 аккаунтов — базовые значения (коэффициент 1.00)", () => {
  const r = calcFarm(10);
  assert.equal(r.accountPrice, 1600);
  assert.equal(r.startBudget, 16000);
  assert.equal(r.monthlyIncomeMin, 2800);
  assert.equal(r.monthlyIncomeMax, 4000);
  assert.equal(r.monthlyIncomeBase, 3400);
  assert.equal(r.paybackImprovementPct, 0);
});

test("цена за аккаунт снижается ступенями на 30 и 100", () => {
  assert.equal(calcFarm(25).accountPrice, 1600);
  assert.equal(calcFarm(30).accountPrice, 1550);
  assert.equal(calcFarm(100).accountPrice, 1500);
});

test("окупаемость улучшается с каждым шагом объёма (нет плато)", () => {
  const p10 = calcFarm(10).paybackMonthsBase;
  const p30 = calcFarm(30).paybackMonthsBase;
  const p50 = calcFarm(50).paybackMonthsBase;
  const p100 = calcFarm(100).paybackMonthsBase;
  const p200 = calcFarm(200).paybackMonthsBase;
  const p300 = calcFarm(300).paybackMonthsBase;
  assert.ok(p10 > p30, `${p10} > ${p30}`);
  assert.ok(p30 > p50, `${p30} > ${p50}`);
  assert.ok(p50 > p100, `${p50} > ${p100}`);
  assert.ok(p100 > p200, `${p100} > ${p200}`);
  assert.ok(p200 > p300, `${p200} > ${p300}`);
});

test("доход на аккаунт растёт с объёмом", () => {
  assert.ok(calcFarm(100).incomePerAccount > calcFarm(10).incomePerAccount);
  assert.ok(calcFarm(300).incomePerAccount > calcFarm(100).incomePerAccount);
});

test("прибыль за год положительная и растёт с объёмом", () => {
  assert.ok(calcFarm(10).yearlyProfitBase > 0);
  assert.ok(calcFarm(100).yearlyProfitBase > calcFarm(10).yearlyProfitBase);
});

test("выгода масштаба: на 100+ окупаемость заметно быстрее старта", () => {
  assert.ok(calcFarm(100).paybackImprovementPct >= 8);
  assert.ok(calcFarm(300).paybackImprovementPct > calcFarm(100).paybackImprovementPct);
});

test("расчёт по бюджету", () => {
  assert.deepEqual(maxAccountsForBudget(16000), { count: 10, enough: true });
  assert.equal(maxAccountsForBudget(80000).enough, true);
  assert.ok(maxAccountsForBudget(80000).count >= 50);
  assert.equal(maxAccountsForBudget(10000).enough, false); // мало даже на минимум
  assert.equal(maxAccountsForBudget(10000).count, 10);
  // На пороге 100 аккаунтов старт дешевле, чем 95: бюджет 150000 даёт 100.
  assert.equal(maxAccountsForBudget(150000).count, 100);
  assert.equal(maxAccountsForBudget(5_000_000).count, 300); // упирается в максимум
});

test("clamp к границам и шагу", () => {
  assert.equal(calcFarm(3).accountsCount, 10);
  assert.equal(calcFarm(999).accountsCount, 300);
  assert.equal(calcFarm(12).accountsCount, 10);
  assert.equal(calcFarm(13).accountsCount, 15);
});
