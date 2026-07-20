// Тести для чистої логіки застосунку "Облік".
// Запуск: node tests/logic.test.mjs
//
// Це НЕ тести самого index.html (там усе завʼязано на DOM і Telegram SDK,
// для цього знадобився б headless-браузер типу Playwright). Натомість тут
// продубльована "розрахункова" логіка — гроші, валюти, дати, CSV —
// саме та, де найлегше випадково зламати щось цифрою.
//
// ВАЖЛИВО: якщо міняєш відповідну функцію в index.html, онови її і тут,
// інакше тест буде перевіряти вже неактуальну копію.

import assert from 'node:assert/strict';

// ---------- Копії чистих функцій з index.html ----------

const parseNum = (v) => parseFloat(String(v || '').replace(',', '.'));
const parseRate = (v) => parseFloat(String(v || '').replace(/[^\d.,]/g, '').replace(',', '.'));

function toUAH(amount, currency, rates) {
  return currency === 'UAH' ? amount : amount * (rates[currency] || 0);
}
function fromUAH(amountUAH, currency, rates) {
  if (currency === 'UAH') return amountUAH;
  return amountUAH / (rates[currency] || 1);
}

function ledgerTotals(list) {
  const inc = list.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const exp = list.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { inc, exp };
}

function monthTotals(list, ym) {
  const items = list.filter(t => t.date.startsWith(ym));
  const inc = items.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const exp = items.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { inc, exp, bal: inc - exp };
}

function prevMonthYM(ym) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

function csvEscape(rows) {
  return rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
}

function categoryLimitStatus(amountSpent, limit) {
  if (!limit) return 'none';
  if (amountSpent >= limit) return 'over';
  if (amountSpent >= limit * 0.8) return 'warn';
  return 'ok';
}

// ---------- Дуже маленький тест-раннер ----------

let passed = 0, failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    ${err.message}`);
    failed++;
  }
}
function section(name) { console.log(`\n${name}`); }

// ---------- Тести ----------

section('parseNum / parseRate — введені суми');
test('розуміє крапку', () => assert.equal(parseNum('123.45'), 123.45));
test('розуміє кому як десятковий роздільник', () => assert.equal(parseNum('123,45'), 123.45));
test('порожній рядок -> NaN, не крешить', () => assert.ok(Number.isNaN(parseNum(''))));
test('parseRate прибирає пробіли-розділювачі тисяч', () => assert.equal(parseRate('2 780 000'), 2780000));
test('parseRate працює з комою', () => assert.equal(parseRate('50,9'), 50.9));

section('Конвертація валют (toUAH / fromUAH)');
const rates = { EUR: 50, USD: 44, BTC: 2800000 };
test('UAH -> UAH без змін', () => assert.equal(toUAH(100, 'UAH', rates), 100));
test('EUR -> UAH множить на курс', () => assert.equal(toUAH(10, 'EUR', rates), 500));
test('UAH -> EUR ділить на курс', () => assert.equal(fromUAH(500, 'EUR', rates), 10));
test('конвертація туди-назад повертає вихідне число', () => {
  const uah = toUAH(0.01, 'BTC', rates);
  const back = fromUAH(uah, 'BTC', rates);
  assert.ok(Math.abs(back - 0.01) < 1e-9);
});
test('невідома валюта не падає (0 замість краху)', () => assert.equal(toUAH(10, 'XXX', rates), 0));

section('Підсумки доходів/витрат (ledgerTotals)');
const sampleList = [
  { type: 'income', amount: 1000, date: '2026-07-01' },
  { type: 'expense', amount: 300, date: '2026-07-02' },
  { type: 'expense', amount: 200, date: '2026-06-15' },
];
test('рахує дохід і витрати окремо', () => {
  const { inc, exp } = ledgerTotals(sampleList);
  assert.equal(inc, 1000);
  assert.equal(exp, 500);
});
test('порожній список -> нулі, без помилок', () => {
  const { inc, exp } = ledgerTotals([]);
  assert.equal(inc, 0);
  assert.equal(exp, 0);
});

section('Місячні підсумки (monthTotals / prevMonthYM)');
test('фільтрує тільки записи потрібного місяця', () => {
  const t = monthTotals(sampleList, '2026-07');
  assert.equal(t.inc, 1000);
  assert.equal(t.exp, 300);
  assert.equal(t.bal, 700);
});
test('попередній місяць у межах року', () => assert.equal(prevMonthYM('2026-07'), '2026-06'));
test('попередній місяць через межу року (січень -> грудень минулого року)', () => {
  assert.equal(prevMonthYM('2026-01'), '2025-12');
});

section('Ліміти по категоріях');
test('без ліміту -> none', () => assert.equal(categoryLimitStatus(500, 0), 'none'));
test('до 80% ліміту -> ok', () => assert.equal(categoryLimitStatus(700, 1000), 'ok'));
test('80-99% ліміту -> warn', () => assert.equal(categoryLimitStatus(850, 1000), 'warn'));
test('100%+ ліміту -> over', () => assert.equal(categoryLimitStatus(1000, 1000), 'over'));

section('CSV-експорт (екранування)');
test('звичайний рядок без спецсимволів', () => {
  const csv = csvEscape([['Продукти', '450']]);
  assert.equal(csv, '"Продукти","450"');
});
test('лапки всередині значення екрануються подвоєнням', () => {
  const csv = csvEscape([['Кава "на виніс"', '80']]);
  assert.equal(csv, '"Кава ""на виніс""","80"');
});
test('декілька рядків розділені CRLF', () => {
  const csv = csvEscape([['a', '1'], ['b', '2']]);
  assert.equal(csv, '"a","1"\r\n"b","2"');
});

// ---------- Підсумок ----------

console.log(`\n${passed} пройшло, ${failed} провалилось`);
if (failed > 0) process.exit(1);
