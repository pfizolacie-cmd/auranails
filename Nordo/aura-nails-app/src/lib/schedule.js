/* Práca s časom a dostupnosťou termínov.
 *
 * Aura Nails je soloprevádzka — v jednom okamihu môže prebiehať práve jeden
 * termín. Dostupnosť sa preto počíta ako hľadanie medzery v jednom kalendári,
 * nie ako obsadenosť viacerých kresiel. */

import { WORKING_HOURS } from '../data/salon.js';

const DAYS_SHORT = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
const DAYS_LONG = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];
const MONTHS_GEN = [
  'januára', 'februára', 'marca', 'apríla', 'mája', 'júna',
  'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra',
];

/** '09:30' → 570 */
export function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** 570 → '09:30' */
export function toTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Date → '2026-08-16'. Lokálny dátum, zámerne nie toISOString() (ten posúva o timezone). */
export function dayKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** '2026-08-16' → Date o polnoci lokálneho času. */
export function fromDayKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const shortDayName = (date) => DAYS_SHORT[date.getDay()];
export const longDayName = (date) => DAYS_LONG[date.getDay()];

/** Date → 'štvrtok 16. augusta' */
export function formatLongDate(date) {
  return `${longDayName(date).toLowerCase()} ${date.getDate()}. ${MONTHS_GEN[date.getMonth()]}`;
}

/** '2026-08-16' + '09:30' → 'štvrtok 16. augusta o 09:30' */
export function formatWhen(key, time) {
  return `${formatLongDate(fromDayKey(key))} o ${time}`;
}

/** '2026-08-16' → '16. augusta 2026' — pre históriu, kde čas nehrá rolu. */
export function formatDay(key) {
  const d = fromDayKey(key);
  return `${d.getDate()}. ${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;
}

/** Nasledujúcich `count` dní počnúc dneškom. */
export function nextDays(count = 14, from = new Date()) {
  const base = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d;
  });
}

/** Celkové trvanie termínu vrátane doplnkov. */
export function totalMins(service, addons = []) {
  return (service?.mins || 0) + addons.reduce((sum, a) => sum + (a.mins || 0), 0);
}

/** Celková cena termínu vrátane doplnkov. */
export function totalPrice(service, addons = []) {
  return (service?.price || 0) + addons.reduce((sum, a) => sum + (a.price || 0), 0);
}

/**
 * Voľné začiatky pre daný deň a dĺžku úkonu.
 *
 * Termín je voľný, keď sa celý zmestí do prevádzkového okna a neprekrýva sa so
 * žiadnou existujúcou rezerváciou. Pri dnešku sa zahodia časy, ktoré už ubehli.
 *
 * @param {string} key      deň vo formáte '2026-08-16'
 * @param {number} duration dĺžka úkonu v minútach vrátane doplnkov
 * @param {Array}  bookings všetky rezervácie (aj iných dní, filtruje sa tu)
 * @param {Date}   now      referenčný čas, kvôli testovateľnosti
 * @returns {Array<{time: string, available: boolean}>}
 */
export function slotsForDay(key, duration, bookings, now = new Date()) {
  const open = toMinutes(WORKING_HOURS.start);
  const close = toMinutes(WORKING_HOURS.end);
  const step = WORKING_HOURS.stepMins;

  const busy = bookings
    .filter((b) => b.day === key && b.status === 'active')
    .map((b) => ({ start: toMinutes(b.time), end: toMinutes(b.time) + b.mins }));

  const isToday = key === dayKey(now);
  const cutoff = isToday ? now.getHours() * 60 + now.getMinutes() : -1;

  const out = [];
  for (let start = open; start + duration <= close; start += step) {
    const end = start + duration;
    const overlaps = busy.some((b) => start < b.end && end > b.start);
    const past = start <= cutoff;
    out.push({ time: toTime(start), available: !overlaps && !past });
  }
  return out;
}

/** Koľko hodín zostáva do termínu — kvôli stornopoplatku. */
export function hoursUntil(key, time, now = new Date()) {
  const d = fromDayKey(key);
  d.setMinutes(toMinutes(time));
  return (d.getTime() - now.getTime()) / 3_600_000;
}
