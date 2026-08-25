/* Údaje prevádzky Aura Nails.
 *
 * Kontakt, služby a ceny pochádzajú z pamäte o klientovi (skill `aura-nails`,
 * stav august 2026, zdroj www.auranails.sk). Pri zmene cenníka stačí upraviť
 * tento súbor — appka nikde inde ceny natvrdo neuvádza.
 *
 * POZOR — TRVANIA SÚ ODHAD. Zdroj uvádza ceny, nie dĺžky procedúr. Hodnoty
 * `mins` nižšie sú odhadnuté podľa typu úkonu, aby vedel fungovať výpočet
 * voľných termínov. Nechajte si ich potvrdiť od Michaely a prepíšte ich.
 */

export const SALON = {
  name: 'Aura Nails',
  legalName: 'Aura Nails MF',
  owner: 'Michaela Foltánová',
  street: 'Námestie Baníkov 2',
  zip: '972 51',
  city: 'Handlová',
  phone: '+421 915 539 600',
  instagram: '@aura_nails_mf',
  web: 'www.auranails.sk',
  hours: 'Pondelok – Nedeľa, na objednávku',
  specialization: 'Natural Nails',
  training: 'Juliannea Academy / Ruscona',
  products: 'Ruccona',
};

/* Pravidlá prevádzky, ktoré appka vynucuje alebo zobrazuje. */
export const POLICY = {
  cancelWindowHours: 24,
  cancelFeeEur: 15,
  warrantyHours: 48,
  warrantyNote: 'Záruka na modeláže je 48 hodín od termínu a nevzťahuje sa na mechanické poškodenie.',
};

export const CATEGORIES = [
  { id: 'gel', name: 'Gélové nechty', icon: 'sparkles' },
  { id: 'manikura', name: 'Manikúra', icon: 'heart' },
  { id: 'starostlivost', name: 'Odborná starostlivosť', icon: 'rotate-ccw' },
];

export const SERVICES = [
  // Gélové nechty
  { id: 'model-kratke', category: 'gel', name: 'Nová modelácia — krátke', price: 33, mins: 90 },
  { id: 'model-stredne', category: 'gel', name: 'Nová modelácia — stredné', price: 35, mins: 105 },
  { id: 'model-dlhe', category: 'gel', name: 'Nová modelácia — dlhé', price: 38, mins: 120 },
  { id: 'doplnenie-kratke', category: 'gel', name: 'Doplnenie — krátke', price: 30, mins: 75 },
  { id: 'doplnenie-stredne', category: 'gel', name: 'Doplnenie — stredné', price: 32, mins: 90 },
  { id: 'doplnenie-dlhe', category: 'gel', name: 'Doplnenie — dlhé', price: 35, mins: 105 },
  { id: 'jednorazove', category: 'gel', name: 'Jednorázové', price: 40, mins: 120, note: 'Kompletná modeláž na jednu príležitosť' },
  { id: 'gel-lak', category: 'gel', name: 'Gél lak', price: 28, mins: 60, note: 'Trvácny lak na prírodné nechty' },

  // Manikúra
  { id: 'pristrojova', category: 'manikura', name: 'Prístrojová manikúra', price: 20, mins: 45 },
  { id: 'spa', category: 'manikura', name: 'SPA manikúra s peelingom', price: 25, mins: 60 },
  { id: 'zabal', category: 'manikura', name: 'Hydratačný zábal a masáž rúk', price: 10, mins: 20 },

  // Odborná starostlivosť
  { id: 'odstranenie', category: 'starostlivost', name: 'Odstránenie nechtov', price: 15, mins: 30 },
  { id: 'odstranenie-plus', category: 'starostlivost', name: 'Odstránenie + prístrojová manikúra', price: 25, mins: 60 },
  { id: 'ibx', category: 'starostlivost', name: 'IBX regeneračná kúra', price: 15, mins: 30 },
  { id: 'ibx-plus', category: 'starostlivost', name: 'IBX kúra + prístrojová manikúra', price: 25, mins: 60 },
];

/* Doplnky sa pripínajú k službe, nie sú samostatný termín.
 * `mins` je čas navyše, o ktorý sa termín predĺži. */
export const ADDONS = [
  { id: 'french', name: 'Francúzska manikúra', price: 3, mins: 10 },
  { id: 'french-vstavana', name: 'Francúzska manikúra (vstavaná)', price: 5, mins: 15 },
  { id: 'babyboomer', name: 'Babyboomer (vstavaný)', price: 3, mins: 15 },
];

/* Samostatný úkon mimo objednaného termínu — v cenníku, nie v rezervačnom toku. */
export const EXTRAS = [
  { id: 'oprava', name: 'Oprava nechtu mimo termín', price: 3 },
];

/* Prevádzkové okno pre generovanie termínov. Štúdio funguje na objednávku,
 * takže nejde o otváracie hodiny, ale o čas, v ktorom Michaela prijíma
 * klientky. Uprav podľa jej skutočných zvyklostí. */
export const WORKING_HOURS = { start: '08:00', end: '18:00', stepMins: 30 };

/* Aura Pass — vernostný program.
 * Prevzaté z existujúcej appky: jedna pečiatka za návštevu, po piatich odmena.
 * Pečiatky pridáva Michaela, klientka ich vidí naživo. */
export const AURA_PASS = {
  maxStamps: 5,
  howItWorks: 'Za každú návštevu vám Michaela pridá pečiatku.',
  rewardHint: 'Po 5 pečiatkach získate odmenu.',
  rewardReady: 'Máte 5 pečiatok — pri ďalšej návšteve vám Michaela uplatní odmenu.',
};

/* Ukážková klientela. Pri ostrom nasadení sem príde napojenie na databázu.
 * Tvar záznamu zodpovedá existujúcej appke, aby sa dali dáta prebrať:
 * meno, kontakt, pečiatky, počet návštev, poznámky, narodeniny, história. */
export const CLIENTS = [
  {
    id: 'c1', name: 'Zuzana Krajčíová', phone: '+421 903 118 224', email: 'zuzana.krajciova@example.sk',
    stamps: 3, visits: 14, since: '2024', birthday: '1992-03-14', notes: '',
    history: [
      { service: 'Doplnenie — stredné', date: '2026-07-26' },
      { service: 'Gél lak', date: '2026-06-14' },
    ],
  },
  {
    id: 'c2', name: 'Lucia Bendová', phone: '+421 908 442 019', email: 'lucia.bendova@example.sk',
    stamps: 5, visits: 9, since: '2024', birthday: '1988-08-22', notes: 'Preferuje kratšie nechty.',
    history: [{ service: 'Gél lak', date: '2026-08-02' }],
  },
  {
    id: 'c3', name: 'Martina Hrušková', phone: '+421 911 507 336', email: 'martina.hruskova@example.sk',
    stamps: 1, visits: 21, since: '2023', birthday: '1995-11-03', notes: 'Alergia na acetón.',
    history: [{ service: 'Nová modelácia — dlhé', date: '2026-07-13' }],
  },
  {
    id: 'c4', name: 'Simona Vargová', phone: '+421 949 720 145', email: '',
    stamps: 0, visits: 3, since: '2026', birthday: '', notes: '',
    history: [{ service: 'SPA manikúra s peelingom', date: '2026-05-15' }],
  },
  {
    id: 'c5', name: 'Katarína Molnárová', phone: '+421 917 883 902', email: 'katarina.m@example.sk',
    stamps: 4, visits: 6, since: '2025', birthday: '1990-01-29', notes: '',
    history: [{ service: 'IBX regeneračná kúra', date: '2026-06-28' }],
  },
];

/* Prihlásená zákazníčka — v ostrej verzii príde z prihlásenia. */
export const CURRENT_CLIENT = { id: 'c1', name: 'Zuzana Krajčíová', phone: '+421 903 118 224' };

/** Prázdna klientka pre formulár pridania. */
export const emptyClient = () => ({
  name: '', phone: '', email: '', stamps: 0, visits: 0,
  since: String(new Date().getFullYear()), birthday: '', notes: '', history: [],
});

export const getService = (id) => SERVICES.find((s) => s.id === id) || null;
export const getAddon = (id) => ADDONS.find((a) => a.id === id) || null;
export const getClient = (id) => CLIENTS.find((c) => c.id === id) || null;
