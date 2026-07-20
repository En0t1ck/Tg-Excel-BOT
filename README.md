# Tg-Excel-BOT

🇺🇦 [Українською](#українською) · 🇬🇧 [In English](#in-english)

<p align="center">
  <img src="screenshot.png" alt="Скріншот застосунку / App screenshot" width="320">
</p>

---

## Українською

Telegram Mini App для обліку особистих фінансів — [@ToloGarExcelbot](https://t.me/ToloGarExcelbot).

Робиться для себе і для приколу, частково довайбкодено 🙂 Але вже з тестами і роадмапом — щоб не соромно було в портфоліо.

### Що вміє зараз

**Особисте**
- Облік доходів/витрат по категоріях, з балансом
- Редагування і видалення записів (з підтвердженням)
- Швидкі пресети суми (+100/+500/+1000/+2000)
- Графік балансу за 14 днів
- Порівняння витрат тиждень-до-тижня або місяць-до-місяця
- Ліміти на категорії з візуальним попередженням (80% / 100%+)
- Повторювані щомісячні платежі (додаються самі при відкритті)

**Накопичення**
- Рахунки в кількох валютах: ₴ / € / $ / ₿
- Перемикач валюти показу загальної суми
- Ціль накопичень із прогрес-баром

**Налаштування**
- Курси валют — автоматично з Монобанку і CoinGecko, або вручну
- Світла / темна / авто тема
- Свої категорії (додати/видалити)
- Експорт у CSV (записи окремо, накопичення окремо)

### Стек
Один файл `index.html` — HTML/CSS/JS, без бекенду. Telegram WebApp SDK +
Telegram CloudStorage API для збереження даних. Хостинг — Netlify.

### Тестування

```bash
node tests/logic.test.mjs
```

Перевіряє чисту розрахункову логіку (гроші, валюти, дати, CSV) — без браузера,
без залежностей. UI-частину (кнопки, форми, теми) поки що перевіряю руками за
чеклистом у [`MANUAL_TESTING.md`](./MANUAL_TESTING.md) перед кожним релізом.

### Запустити свою копію
1. Задеплой `index.html` на Netlify (або будь-де з HTTPS)
2. Створи бота через [@BotFather](https://t.me/BotFather)
3. `/mybots` → обери бота → **Bot Settings** → **Menu Button** → встав посилання

### Роадмап

**v0.x — зараз** ✅
Особисте + накопичення + налаштування, все на CloudStorage, без бекенду.

**v0.5 — зручність вводу**
- [ ] Свої категорії: перейменування вбудованих (не тільки додавання нових)
- [ ] Пошук і фільтр записів (за категорією, датою, сумою)
- [ ] Прикріплення фото чека до запису

**v0.6 — аналітика**
- [ ] Графік по місяцях (не тільки 14 днів)
- [ ] Порівняння категорій між періодами, а не тільки загальних витрат
- [ ] Прогноз накопичень при поточному темпі

**v1.0 — бекенд (Python)**
- [ ] Бот сам нагадує ввечері записати витрати
- [ ] Тижневі/місячні звіти прямо в чат
- [ ] Швидкий запис текстом у чат боту ("продукти 450") без відкриття застосунку
- [ ] Автоматичні курси валют без обмежень CloudStorage
- [ ] Справжня база даних замість CloudStorage (без лімітів на розмір)

**Пізніше / під питанням**
- [ ] Спільний доступ (сім'я/партнер бачать одні дані)
- [ ] Веб-дашборд окремо від Telegram
- [ ] Інтеграція з банківськими виписками (нюанси безпеки, поки не пріоритет)

---

## In English

Telegram Mini App for personal finance tracking — [@ToloGarExcelbot](https://t.me/ToloGarExcelbot).

Built for fun and personal use, partially vibe-coded — but now with tests and a real roadmap.

### Current features

**Personal**
- Income/expense tracking by category, with running balance
- Edit and delete entries (with confirmation)
- Quick amount presets (+100/+500/+1000/+2000)
- 14-day balance chart
- Week-over-week or month-over-month expense comparison
- Category spending limits with visual warnings (80% / 100%+)
- Recurring monthly payments (auto-added on app open)

**Savings**
- Multi-currency accounts: ₴ / € / $ / ₿
- Toggle which currency the total is displayed in
- Savings goal with a progress bar

**Settings**
- Exchange rates — auto-fetched from Monobank and CoinGecko, or manual
- Light / dark / auto theme
- Custom categories (add/remove)
- CSV export (transactions and savings separately)

### Stack
Single `index.html` file — HTML/CSS/JS, no backend. Telegram WebApp SDK +
Telegram CloudStorage API for persistence. Hosted on Netlify.

### Testing

```bash
node tests/logic.test.mjs
```

Covers the pure calculation logic (money, currencies, dates, CSV) — no
browser, no dependencies. UI flows are checked manually against
[`MANUAL_TESTING.md`](./MANUAL_TESTING.md) before each release.

### Run your own copy
1. Deploy `index.html` to Netlify (or anywhere with HTTPS)
2. Create a bot via [@BotFather](https://t.me/BotFather)
3. `/mybots` → select your bot → **Bot Settings** → **Menu Button** → paste the URL

### Roadmap

**v0.x — now** ✅ Personal + savings + settings, CloudStorage only, no backend.

**v0.5 — input UX**: rename built-in categories, search/filter entries, attach receipt photos.

**v0.6 — analytics**: monthly charts, per-category period comparison, savings forecast.

**v1.0 — Python backend**: evening reminders, weekly/monthly reports in chat, quick text logging ("groceries 450"), unlimited exchange-rate automation, a real database instead of CloudStorage.

**Later / maybe**: shared access (family/partner), a standalone web dashboard, bank statement integration (security tradeoffs, not a priority yet).

---

## License
MIT
