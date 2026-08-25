/* Slovenské skloňovanie podstatných mien po číslovke.
 *
 * 1 návšteva · 2–4 návštevy · 5 a viac návštev — a rovnako aj pri zložených
 * číslovkách (21 návštev, 22 návštev), kde slovenčina používa genitív množného
 * čísla, nie tvar podľa poslednej číslice. */

export function plural(count, one, few, many) {
  if (count === 1) return one;
  if (count >= 2 && count <= 4) return few;
  return many;
}

/** '3 návštevy' */
export const withCount = (count, one, few, many) =>
  `${count} ${plural(count, one, few, many)}`;
