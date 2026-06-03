# Деплой FARMCORE на farmcore.ru

Сайт на **Next.js 14** с серверными функциями (API заявок в Telegram, динамические OG-картинки),
поэтому нужен **Node.js-хостинг** (не обычный «PHP-шаред»). Ниже два рабочих пути.

---

## Вариант A — VPS/Node-сервер (рекомендуется)

Подходит почти любой VPS (в т.ч. reg.ru «Облачные серверы»). Нужен Node.js 18+.

### 1. Подготовка сервера
```bash
# Node.js 20 (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# менеджер процессов
sudo npm i -g pm2
```

### 2. Загрузка проекта и переменные окружения
Скопируйте проект на сервер (git/scp). Создайте файл `.env` рядом с `package.json`:
```
Bot_Token=ВАШ_ТОКЕН
LEAD_CHAT_ID=8372368745
TELEGRAM_PROXY=http://user:pass@host:port   # если нужен; иначе оставьте пустым
NEXT_PUBLIC_YM_ID=                            # ID Яндекс.Метрики (число)
```

### 3. Сборка и запуск
```bash
npm ci
npm run build
pm2 start "npm run start" --name farmcore
pm2 save
pm2 startup        # автозапуск после перезагрузки
```
По умолчанию приложение слушает порт **3000**.

### 4. Nginx + HTTPS
```nginx
server {
  server_name farmcore.ru www.farmcore.ru;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
Бесплатный SSL:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d farmcore.ru -d www.farmcore.ru
```

### 5. DNS в reg.ru
В панели reg.ru → домен `farmcore.ru` → «DNS-серверы и управление зоной»:
- Запись **A** `@` → IP вашего сервера
- Запись **A** `www` → тот же IP
(Сейчас там стоит парковка `95.163.244.138` — замените на свой IP.)
Обновление DNS занимает от нескольких минут до пары часов.

---

## Вариант B — Vercel (проще всего, но зарубежный хостинг)
Если допустим зарубежный хостинг: подключить репозиторий к Vercel, добавить переменные
окружения в настройках проекта, привязать домен `farmcore.ru` (Vercel подскажет DNS-записи).
Сборка и HTTPS — автоматически. Прокси для Telegram там обычно не нужен.

> Важно: на РУ-хостинге `api.telegram.org` может быть недоступен напрямую — поэтому в коде
> предусмотрен `TELEGRAM_PROXY` (HTTP-прокси) с фолбэком на прямое подключение.

---

## Чек-лист после деплоя
- [ ] Открыть https://farmcore.ru — главная грузится со стилями.
- [ ] Проверить страницы `/ferma-cs2`, `/steam-ferma`, `/kupit-fermu-cs2`, `/privacy`.
- [ ] Отправить тестовую заявку через форму → проверить, что пришла в Telegram.
- [ ] Открыть `https://farmcore.ru/sitemap.xml` и `https://farmcore.ru/robots.txt`.
- [ ] Добавить сайт в **Яндекс.Вебмастер** и **Яндекс.Метрику**, указать `NEXT_PUBLIC_YM_ID`.
- [ ] Проверить превью ссылки в Telegram (должна показаться OG-картинка).

## Обновление сайта
```bash
git pull
npm ci
npm run build
pm2 restart farmcore
```
