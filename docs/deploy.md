# Деплой FARMCORE на farmcore.ru (Timeweb VPS, веб-консоль)

Сайт на **Next.js 14** с серверными функциями (API заявок в Telegram, динамические
OG-картинки), поэтому нужен **Node.js-рантайм** (не обычный PHP-шаред-хостинг).

На сервере уже работает другой проект — **`funpay-ns-bot`** в `/opt/funpay-ns-bot`.
Весь деплой сделан так, чтобы его **не затронуть**:

| Ресурс | funpay-ns-bot | FARMCORE |
|---|---|---|
| Папка | `/opt/funpay-ns-bot` | `/opt/farmcore` |
| Порт | свой | `3000` (локально, наружу не торчит) |
| Процесс | свой | PM2 `farmcore` |
| Nginx | — | отдельный конфиг `farmcore.ru` |

Перезапуск/обновление сайта (`pm2 restart farmcore`) на бота не влияет, и наоборот.

> ## ⚠️ Сетевые особенности этого VPS (по опыту с funpay-ns-bot)
> - **`github.com` напрямую НЕ открывается** → клонировать только через
>   GitHub-зеркало: `https://<MIRROR>/https://github.com/ReStartlex/farmcore.git`.
>   Кандидаты mirror: `gh-proxy.com`, `gh.idayer.com` (проверять, какой живой).
> - **Прокси `166.88.218.111` (SOCKS5/HTTP) с VPS мёртв** (TCP закрыт) — не использовать.
> - **`api.telegram.org` работает напрямую** → в `.env` сайта `TELEGRAM_PROXY`
>   оставляем **пустым**. Прокси бы только вешал форму на таймаут.
> - `registry.npmjs.org`, `deb.nodesource.com`, apt-репозитории — проверить
>   доступность блоком из «Шаг 0».

---

## Шаг 0. Разведка + проверка сети (read-only)
В веб-консоли Timeweb вставить и прислать вывод:
```bash
echo "=== Публичный IP ==="; hostname -I; curl -s --max-time 8 ifconfig.me; echo
echo "=== api.telegram.org (нужно для заявок) ==="; curl -s --max-time 8 -o /dev/null -w "%{http_code} %{time_total}s\n" https://api.telegram.org || echo FAIL
echo "=== npm registry ==="; curl -s --max-time 8 -o /dev/null -w "%{http_code} %{time_total}s\n" https://registry.npmjs.org/ || echo FAIL
echo "=== NodeSource ==="; curl -s --max-time 8 -o /dev/null -w "%{http_code} %{time_total}s\n" https://deb.nodesource.com/setup_20.x || echo FAIL
echo "=== github напрямую (ждём FAIL) ==="; curl -s --max-time 8 -o /dev/null -w "%{http_code} %{time_total}s\n" https://github.com/ || echo "FAIL (ожидаемо)"
echo "=== Живое GitHub-зеркало ==="
for b in https://gh-proxy.com https://gh.idayer.com https://ghfast.top https://gh.llkk.cc https://ghproxy.net; do
  curl -sS --max-time 8 -o /tmp/p.bin -w "%{http_code}" "$b/https://github.com/ReStartlex/farmcore.git/info/refs?service=git-upload-pack" >/tmp/code 2>/dev/null
  if head -c 40 /tmp/p.bin 2>/dev/null | grep -q git-upload-pack; then echo "ALIVE $b"; else echo "dead  $b ($(cat /tmp/code))"; fi
done

---

## Шаг 1. Код на GitHub
На локальном ПК (репозиторий уже инициализирован, первый коммит сделан):
```powershell
git remote add origin https://github.com/ВАШ_ЛОГИН/farmcore.git
git push -u origin main
```
> `.env` в репозиторий **не попадает** (он в `.gitignore`). Секреты создаём прямо на сервере.

---

## Шаг 2. Рантайм на сервере (безопасно для бота)
**Если `node -v` ≥ 18.17 уже есть** — пропустить установку Node.

**Если Node нет / старый:** ставим через `nvm` для пользователя, не трогая системный Node бота:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm install 20
node -v
npm i -g pm2
```

---

## Шаг 3. Клонирование (через зеркало!), переменные, сборка
```bash
# MIRROR — живое зеркало из Шага 0 (например, https://gh-proxy.com)
MIRROR=https://gh-proxy.com
cd /opt
git clone "$MIRROR/https://github.com/ReStartlex/farmcore.git"
cd /opt/farmcore
# вернуть origin на прямой github (для информации; pull тоже через зеркало)
git remote set-url origin https://github.com/ReStartlex/farmcore.git

# Переменные окружения (создаём вручную, в git их нет).
# TELEGRAM_PROXY ПУСТОЙ — с этого VPS api.telegram.org доступен напрямую.
cat > .env <<'EOF'
Bot_Token=ВАШ_ТОКЕН_БОТА
LEAD_CHAT_ID=8372368745
TELEGRAM_PROXY=
NEXT_PUBLIC_YM_ID=109622322
YANDEX_VERIFICATION=
EOF
chmod 600 .env

npm ci
npm run build
```

## Шаг 4. Запуск через PM2 (порт 3000)
```bash
pm2 start "npm run start" --name farmcore
pm2 save
pm2 startup        # выполнить выведенную команду, если попросит (автозапуск)
```
Проверка локально: `curl -I http://127.0.0.1:3000` → должен быть `200`.

---

## Шаг 5. Nginx (отдельный конфиг)
```bash
sudo apt-get update && sudo apt-get install -y nginx   # если nginx ещё не стоит
sudo tee /etc/nginx/sites-available/farmcore.ru >/dev/null <<'EOF'
server {
  listen 80;
  server_name farmcore.ru www.farmcore.ru;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
EOF
sudo ln -s /etc/nginx/sites-available/farmcore.ru /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## Шаг 6. DNS в reg.ru
Домен `farmcore.ru` → «DNS-серверы и управление зоной»:
- **A** `@` → IP сервера
- **A** `www` → тот же IP

Подождать распространения (от минут до 1–2 часов). Проверка: `ping farmcore.ru`.

## Шаг 7. Бесплатный SSL (после того как DNS заработал)
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d farmcore.ru -d www.farmcore.ru
```
Certbot сам пропишет HTTPS и редирект с http→https.

---

## Чек-лист после деплоя
- [ ] `https://farmcore.ru` грузится со стилями.
- [ ] Страницы `/ferma-cs2`, `/steam-ferma`, `/kupit-fermu-cs2`, `/privacy` открываются.
- [ ] Тестовая заявка с формы → пришла в Telegram.
- [ ] `https://farmcore.ru/sitemap.xml` и `/robots.txt` отвечают.
- [ ] Сайт добавлен в Яндекс.Вебмастер (код → `YANDEX_VERIFICATION`, затем `pm2 restart farmcore`).
- [ ] Метрика 109622322 ловит визиты.
- [ ] `funpay-ns-bot` по-прежнему работает (`pm2 list`).

## Обновление сайта (не трогает бота)
```bash
cd /opt/farmcore
# github напрямую недоступен → тянем через зеркало
MIRROR=https://gh-proxy.com
git pull "$MIRROR/https://github.com/ReStartlex/farmcore.git" main
npm ci
npm run build
pm2 restart farmcore
```
> Если `gh-proxy.com` не отвечает — подставь другое живое зеркало (Шаг 0).
