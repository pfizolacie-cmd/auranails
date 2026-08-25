# Aura Nails — rezervačná appka

Rezervačná appka nechtového štúdia **Aura Nails** (Námestie Baníkov 2, Handlová — Michaela Foltánová).
Postavená na dizajn systéme `halo-home-design-system`, ktorý leží vedľa v tom istom priečinku.

Je to jedna z troch častí balíka agentúry: **web + rezervačná appka + AI agent**.

---

## Spustenie

Potrebujete Node.js 18 alebo novší.

```bash
npm install
```

```bash
npm run dev
```

Appka nabehne na `http://localhost:5173`. Produkčný build spravíte cez `npm run build`, výsledok je v `dist/`.

---

## Čo appka vie

Nie je to klikací mockup — rezervácie sa naozaj zapisujú, počítajú a prežijú obnovenie stránky.

**Zákaznícka strana**

| Obrazovka | Čo robí |
| --- | --- |
| Rezervácia | Trojkrokový tok: služba (+ doplnky) → deň a čas → potvrdenie. Voľné časy sa počítajú zo skutočnej obsadenosti kalendára a z dĺžky vybraného úkonu — obsadené a už ubehnuté termíny sú neklikateľné. |
| Moje termíny | Nadchádzajúce aj história. Zrušenie je dvojkrokové a vopred ukáže, či sa uplatní stornopoplatok 15 € (menej než 24 hodín do termínu). |
| Cenník | Kompletný cenník, doplnky, podmienky a kontakt. |

**Prevádzková strana (Michaela)**

| Obrazovka | Čo robí |
| --- | --- |
| Deň | Rozvrh vybraného dňa, stav termínu (hotovo / práve teraz / čaká), tržba a obsadenosť. Dni s termínmi majú v prepínači bodku. |
| Klientky | Evidencia s vyhľadávaním podľa mena alebo telefónu, zoradená podľa počtu návštev, s najbližším termínom každej klientky. |

Prepínač **Zákazníčka / Štúdio** prepína obe strany — na širokom displeji je nad rámom telefónu,
na mobile v hornej lište. V ostrej verzii ich oddelí prihlásenie.

Na displeji užšom než 560 px sa appka kreslí na celú plochu, inak do rámu telefónu,
ktorého výška sa prispôsobí výške okna.

---

## Štruktúra

```
src/
├── App.jsx                  prepínač rolí, taby, rám telefónu
├── main.jsx
├── data/salon.js            kontakt, cenník, klientela, prevádzkové pravidlá
├── lib/schedule.js          práca s časom a výpočet voľných termínov
├── state/SalonContext.jsx   rezervácie + perzistencia
├── screens/                 päť obrazoviek
├── components/              komponenty dizajn systému (kópia)
└── styles/                  tokeny dizajn systému (kópia)
```

Komponenty a tokeny sú **kópia** z `halo-home-design-system`, aby bol projekt samostatný.
Keď sa dizajn systém zmení, prekopírujte `components/` a `styles/tokens/` nanovo.

---

## Prispôsobenie ďalšiemu klientovi

Celý obsah prevádzky je v jedinom súbore — `src/data/salon.js`. Vymeňte v ňom kontakt,
kategórie, služby, doplnky a prevádzkové pravidlá a appka je pripravená pre iného klienta.
Ceny ani kontakt nie sú natvrdo nikde inde v kóde.

Prevádzkové okno pre generovanie termínov je `WORKING_HOURS` v tom istom súbore.

---

## Čo treba doplniť

- **Trvania úkonov sú odhad.** Cenník klientky uvádza ceny, nie dĺžky procedúr. Hodnoty `mins`
  v `src/data/salon.js` sú odhadnuté podľa typu úkonu, aby vedel fungovať výpočet voľných
  termínov. Nechajte si ich potvrdiť od Michaely a prepíšte ich — sú to jediné vymyslené čísla v projekte.
- **Prevádzkové okno** `WORKING_HOURS` (08:00 – 18:00) je tiež odhad. Štúdio funguje na objednávku.
- **Klientela** v `CLIENTS` je ukážková.
- **Backend.** Rezervácie sú zatiaľ v `localStorage` prehliadača. Pre ostrú prevádzku treba
  server a napojenie na kalendár — vymenia sa funkcie `load` a `persist` v `src/state/SalonContext.jsx`,
  zvyšok appky sa meniť nemusí.
- **Prihlásenie.** Zákazníčka je natvrdo `CURRENT_CLIENT`, roly sa prepínajú ručne.
