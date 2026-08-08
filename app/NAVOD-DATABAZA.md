# Návod: pripojenie appky k skutočnej databáze (Firebase)

Appka teraz namiesto dočasnej pamäte prehliadača používa **Firebase Firestore**
— bezplatnú databázu. Vďaka tomu klientky, rezervácie a pečiatky zostanú
uložené natrvalo, aj keď appku zavrieš alebo ju otvorí niekto iný.

## 1. Založenie Firebase projektu (5 minút)

1. Choď na **https://console.firebase.google.com** a prihlás sa Google účtom.
2. Klikni **"Add project" / "Pridať projekt"**, pomenuj ho napr. `aura-nails`.
3. Google Analytics pri zakladaní projektu môžeš vypnúť — nie je potrebná.
4. Počkaj, kým sa projekt vytvorí.

## 2. Zapnutie Firestore databázy

1. V ľavom menu klikni **Build → Firestore Database**.
2. Klikni **"Create database"**.
3. Vyber lokalitu servera (napr. `eur3 (europe-west)` — najbližšie k Slovensku).
4. Zvoľ **"Start in production mode"**.

## 3. Nastavenie bezpečnostných pravidiel

V Firestore Database → záložka **"Rules"** nahraď obsah týmto textom
a klikni **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clients/{doc} { allow read, write: if true; }
    match /requests/{doc} { allow read, write: if true; }
    match /appointments/{doc} { allow read, write: if true; }
  }
}
```

**Poznámka k bezpečnosti:** toto pravidlo umožňuje komukoľvek, kto pozná adresu
appky, čítať a zapisovať dáta. Pre malý lokálny biznis (bez platobných kariet
či citlivých údajov) je to bežne akceptovateľné riziko na začiatok. Ak by si
neskôr chcel prísnejšiu ochranu (napr. len Michaela môže mazať klientky), daj
vedieť — dá sa doplniť prihlasovanie.

## 4. Získanie konfigurácie a vloženie do appky

1. V Firebase konzole klikni na ozubené koliesko vedľa "Project Overview" →
   **"Project settings"**.
2. V sekcii "Your apps" klikni na ikonu **`</>`** (Web app).
3. Pomenuj appku (napr. `aura-nails-web`) a klikni **"Register app"**.
4. Zobrazí sa blok kódu s hodnotami ako `apiKey`, `authDomain`, `projectId` atď.
5. Otvor súbor **`firebase-config.js`** z tejto zložky a nahraď hodnoty
   `VLOZ_SEM_...` presne tými, čo ti Firebase ukázal.
6. Ulož súbor.

## 5. Nahratie do GitHubu

Presne rovnakým spôsobom ako predtým — nahraď obsah priečinka `app/` v
repozitári `pfizolacie-cmd/auranails` týmito novými súbormi (najmä
`app.jsx`, `firebase-config.js`, `index.html`, `sw.js`).

Po nahratí a otvorení appky sa Firestore databáza pri prvom spustení
automaticky naplní rovnakými ukážkovými dátami, aké appka mala doteraz
(klientky, termíny, žiadosti) — odtiaľ už všetko, čo sa zmení (nová
rezervácia, pridaná klientka, pečiatka), zostane uložené natrvalo.

## Čo sa reálne zmenilo oproti predošlej verzii

- Klientkina rezervácia sa teraz **skutočne objaví** Michaele v "Žiadosti"
  (predtým to bola len vizuálna ukážka, prepojenie chýbalo).
- Potvrdenie žiadosti automaticky pridá termín do kalendára, zvýši počet
  návštev klientky a pridá jej pečiatku do Aura Pass.
- Aura Pass pečiatky klientky (v jej vlastnom pohľade) a pečiatky, ktoré vidí
  Michaela pri klientke, sú teraz **jedno a to isté číslo** (predtým to boli
  dve nezávislé ukážkové hodnoty).
- Kalendár už nepoužíva pevný "demo" dátum, ale skutočný dnešný dátum.

## Čo (zatiaľ) chýba

- Klientky sa neprihlasujú vlastným účtom — appka na klientskej strane vždy
  zobrazuje jednu demo klientku (Zuzana Kráľová). Skutočné prihlásenie by
  vyžadovalo ďalší krok (napr. cez telefónne číslo).
- SMS/e-mailové pripomienky nie sú zapojené — prepínače v appke sú zatiaľ len
  vizuálne.
