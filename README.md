# FARMCORE — CS2 / Steam фермы под ключ

Премиальный лендинг для продажи аккаунтов и сопровождения CS2/Steam ферм под ключ.
Светлый дизайн, живой калькулятор окупаемости, SEO-подготовка и форма заявки (Telegram / телефон).

## Стек
- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (светлая премиум-тема, токены в `tailwind.config.ts`)
- **framer-motion** (микроанимации, count-up)

## Запуск
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # продакшен-сборка
npm start        # запуск сборки
npm test         # юнит-тесты калькулятора
```

## Структура
```
app/            layout (SEO, шрифты, JSON-LD), page, globals.css, sitemap, robots, api/lead
components/ui/  примитивы (Section, Reveal, AnimatedNumber, Logo)
components/sections/  все блоки лендинга
data/           site.ts (бренд/контакты), faq.ts, scenarios.ts
lib/            calc.ts (логика калькулятора) + calc.test.ts, seo.ts (JSON-LD), utils.ts
docs/           project-brief.md (стратегия проекта)
```

## Где что менять
- **Контакты / имя бренда** — `data/site.ts`.
- **Логика калькулятора и цены** — `lib/calc.ts` (тесты в `calc.test.ts`).
- **Сценарии, FAQ** — `data/scenarios.ts`, `data/faq.ts`.
- **Приём заявок** — `app/api/lead/route.ts` (подключить Telegram-бот / email / CRM).
- **Цвета и тема** — `tailwind.config.ts` + `app/globals.css`.

## Калькулятор: логика
- Цена за аккаунт: 10–29 → 1600 ₽, 30–99 → 1550 ₽, 100+ → 1500 ₽.
- Коэффициент масштаба: 1.00 / 1.08 / 1.15.
- Доход/мес на аккаунт: 70–100 ₽/нед × 4; средний сценарий — середина (~85 ₽/нед).
- Окупаемость = старт / доход. Все цифры — ориентировочные, без гарантий.
