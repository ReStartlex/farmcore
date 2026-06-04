# Деплой FARMCORE через Cloudflare Tunnel — пошаговый план

Этот файл — твоя «дорожная карта» до полного запуска сайта `https://farmcore.ru`
и инструкция по дальнейшему обслуживанию. Написано простым языком, под доступ
**только через веб-консоль Timeweb** (без SSH с ПК).

---

## 0. Почему так (коротко)

IP сервера `85.239.42.127` режется магистральными провайдерами: **ping проходит,
а TCP — нет**. Поддержка Timeweb подтвердила, что с их стороны блокировок нет, и
предложила менять IP (лотерея). Поэтому мы пошли по надёжному пути —
**Cloudflare Tunnel**: сайт выходит наружу через **исходящее** соединение, которому
блокировка входящих портов и «грязный» IP не мешают. Бонус — бесплатный SSL.

```
Посетитель → Cloudflare (HTTPS) → туннель (исходящий из сервера) → localhost:3000 (Next.js)
```

---

## 1. Что уже сделано ✅

- Код на сервере: `/opt/farmcore`, запущен через PM2 (`pm2 list` → `farmcore` online на порту 3000).
- Установлен `cloudflared` (2026.5.2).
- Создан туннель `farmcore` в Cloudflare (Zero Trust), статус **Healthy**.
- Коннектор запущен как systemd-сервис с автозапуском (`systemctl status cloudflared` → active/enabled).
- Домен `farmcore.ru` добавлен в Cloudflare, NS-серверы (`rodrigo.ns.cloudflare.com`,
  `sydney.ns.cloudflare.com`) прописаны в reg.ru.
- `funpay-ns-bot` **не трогали** — работает как работал.

---

## 2. Что осталось сделать (по шагам)

### Шаг 2.1 — Дождаться статуса Active у домена
`dash.cloudflare.com` → `farmcore.ru`. Статус должен смениться
`Invalid/Pending nameservers` → **Active** (от 10 минут до нескольких часов).
Можно ускорить кнопкой «Check nameservers» на странице активации.

### Шаг 2.2 — Удалить старые A-записи
`dash.cloudflare.com` → `farmcore.ru` → **DNS → Records**.
Удалить обе записи типа **A** (`farmcore.ru → 85.239.42.127` и `www → 85.239.42.127`).
Они указывают на заблокированный IP и мешают туннелю.

### Шаг 2.3 — Привязать домен к туннелю
`one.dash.cloudflare.com` → **Networks → Tunnels** → туннель **farmcore** → **Configure**
→ вкладка **Public Hostname** → **Add a public hostname**:

| Поле | Значение (apex) | Значение (www) |
|------|-----------------|----------------|
| Subdomain | *(пусто)* | `www` |
| Domain | `farmcore.ru` | `farmcore.ru` |
| Path | *(пусто)* | *(пусто)* |
| Type | `HTTP` | `HTTP` |
| URL | `localhost:3000` | `localhost:3000` |

Сохрани оба. В колонке **Routes** появятся `farmcore.ru` и `www.farmcore.ru`,
а в DNS Cloudflare автоматически создадутся CNAME-записи (Proxied).

### Шаг 2.4 — Проверить сайт
Открой **https://farmcore.ru** — должен открыться сайт с замочком (SSL).
Проверь и **https://www.farmcore.ru**.

---

## 3. Рекомендуемые настройки Cloudflare (после запуска)

В `dash.cloudflare.com` → `farmcore.ru`:

1. **SSL/TLS → Overview** → режим **Full** (не Flexible — иначе возможна петля редиректов).
2. **SSL/TLS → Edge Certificates** → включить **Always Use HTTPS** (весь трафик на https).
3. **SSL/TLS → Edge Certificates** → **Automatic HTTPS Rewrites** = On.
4. *(опц.)* **Rules → Redirect Rules** — редирект `www.farmcore.ru` → `farmcore.ru`
   (или наоборот), чтобы был один основной адрес. Не обязательно, оба и так работают.
5. *(опц.)* **Speed / Caching** — Cloudflare сам кэширует статику, дополнительно настраивать не нужно.

---

## 4. Финальная проверка (чек-лист запуска)

- [ ] `https://farmcore.ru` открывается, есть замочек (SSL).
- [ ] `https://www.farmcore.ru` открывается.
- [ ] Калькулятор считает, 3D-сцена в hero грузится на десктопе.
- [ ] **Заявка доходит в Telegram**: заполни форму на сайте → проверь, что бот прислал заявку.
      Если не пришла — см. раздел 6 (Telegram).
- [ ] Яндекс.Метрика (`109622322`) видит визит (Метрика → Сводка, в реальном времени).
- [ ] `https://farmcore.ru/sitemap.xml` и `/robots.txt` отдаются.
- [ ] Бот `funpay-ns-bot` жив (`pm2 list` или его способ запуска — статус running).
- [ ] Перезагрузка-тест (по желанию): `sudo reboot` → через минуту сайт и бот
      поднялись сами (PM2 + cloudflared в автозапуске).

---

## 5. Обслуживание: как обновлять сайт

Когда нужно выкатить изменения кода (после `git push` в GitHub):

```bash
cd /opt/farmcore
git pull
npm ci
npm run build
pm2 restart farmcore
```

> На сервере мало RAM — если `npm run build` падает с «killed/out of memory»,
> убедись, что включён swap: `free -h` (должно быть ~2G swap). Если нет:
> ```bash
> sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
> echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
> ```

### Полезные команды

```bash
pm2 list                         # статус процессов (farmcore + бот)
pm2 logs farmcore --lines 50     # логи сайта
pm2 restart farmcore             # перезапуск сайта
systemctl status cloudflared     # статус туннеля
sudo systemctl restart cloudflared   # перезапуск туннеля
journalctl -u cloudflared -n 50 --no-pager   # логи туннеля
curl -I http://127.0.0.1:3000    # сайт жив локально? (ожидаем 200)
```

### Изменение переменных окружения (.env)

Файл: `/opt/farmcore/.env`. После правки:
```bash
cd /opt/farmcore && pm2 restart farmcore --update-env
```

> ⚠️ Переменные, которые попадают в HTML страниц (`YANDEX_VERIFICATION`,
> `NEXT_PUBLIC_YM_ID` и любые `NEXT_PUBLIC_*`), «впекаются» при сборке.
> После их изменения нужен **полный ребилд**, иначе на статических страницах
> значение не обновится:
> ```bash
> cd /opt/farmcore && npm run build && pm2 restart farmcore --update-env
> ```
> Для `Bot_Token` / `LEAD_CHAT_ID` / `TELEGRAM_PROXY` (используются только в API
> `/api/lead` на сервере) достаточно `pm2 restart farmcore --update-env`.
Текущие переменные (см. `.env.example`):
- `Bot_Token` — токен Telegram-бота от @BotFather.
- `LEAD_CHAT_ID` — куда слать заявки (твой chat_id).
- `TELEGRAM_PROXY` — оставить **пустым** (прямое подключение работает).
- `NEXT_PUBLIC_YM_ID` — `109622322` (Яндекс.Метрика).
- `YANDEX_VERIFICATION` — код подтверждения в Яндекс.Вебмастере.

---

## 6. Если что-то не работает (траблшутинг)

### Сайт не открывается — `Error 1033` / «Tunnel error»
Туннель не подключён. На сервере:
```bash
systemctl status cloudflared --no-pager | head -15
sudo systemctl restart cloudflared
```
Проверь в панели: туннель `farmcore` = **Healthy**.

### `Error 502 / 1016 / Bad Gateway`
Туннель работает, но не достучался до сайта. Проверь, что сайт жив:
```bash
pm2 list
curl -I http://127.0.0.1:3000     # должно быть 200
pm2 restart farmcore
```
И что в Public Hostname указан именно `localhost:3000` (HTTP, не HTTPS).

### Бесконечный редирект (`ERR_TOO_MANY_REDIRECTS`)
В Cloudflare **SSL/TLS → режим Full** (не Flexible). См. раздел 3.

### Заявка не приходит в Telegram
```bash
cd /opt/farmcore
pm2 logs farmcore --lines 80      # ищем ошибки при отправке заявки
cat .env | grep -E 'Bot_Token|LEAD_CHAT_ID'   # заполнены ли
```
- Проверь, что `Bot_Token` верный и ты написал боту `/start`.
- `LEAD_CHAT_ID` должен быть числом (твой chat_id). Узнать: написать боту,
  затем открыть `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и найти `"chat":{"id":...}`.
- Если `api.telegram.org` недоступен с сервера — заполнить `TELEGRAM_PROXY` и `pm2 restart farmcore`.

### Сайт открылся, но не обновился после изменений
Сделал ли ты `npm run build` и `pm2 restart farmcore`? Также сбрось кэш Cloudflare:
панель → **Caching → Configuration → Purge Everything**.

---

## 7. Важные напоминания

- **IP сервера менять не нужно** — туннель решает проблему блокировки.
- **`funpay-ns-bot` не трогаем** — он работает независимо, на других портах/процессе.
- **Входящие порты (80/443) больше не нужны** — весь трафик идёт через туннель.
  Nginx/Certbot для сайта не требуются (можно не настраивать SSL вручную).
- **Токен туннеля** даёт доступ к управлению туннелем. Он засветился в чате —
  при желании позже можно пересоздать туннель и обновить токен (одна команда `service install`).
- Бэкап `.env` храни отдельно (там токен бота) — он не в Git.

---

## 8. Контакты служб

- Cloudflare дашборд: `dash.cloudflare.com` (DNS, SSL) и `one.dash.cloudflare.com` (туннели).
- Регистратор домена: reg.ru (там только NS-серверы, всё остальное теперь в Cloudflare).
- Хостинг сервера: Timeweb (`timeweb.cloud/my/servers/7948100`), доступ — веб-консоль.
- Яндекс.Метрика: счётчик `109622322`. Яндекс.Вебмастер — для индексации.
