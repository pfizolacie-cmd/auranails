# Návod: databáza, prihlasovanie a prehľad funkcií appky

Appka používa **Firebase Firestore** (databáza) a **Firebase
Authentication** (prihlasovanie). Klientky sa registrujú menom, emailom
a heslom. Michaela sa prihlasuje samostatným admin účtom, ktorý sa
zakladá ručne (krok 4).

## 1. Založenie Firebase projektu

Toto už máš hotové (projekt `aura-nails-kalendar`).

## 2. Zapnutie Firestore databázy a pravidlá

Firestore Database → záložka **Rules** → nahraď celý obsah týmto textom
a klikni **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    match /admins/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if false;
    }
    match /clients/{id} {
      allow read: if request.auth != null && (request.auth.uid == id || isAdmin());
      allow create: if request.auth != null && request.auth.uid == id;
      allow update: if isAdmin() || (
        request.auth != null && request.auth.uid == id &&
        request.resource.data.stamps == resource.data.stamps &&
        request.resource.data.visits == resource.data.visits &&
        request.resource.data.history == resource.data.history
      );
      allow delete: if isAdmin();
    }
    match /requests/{id} {
      allow create: if request.auth != null;
      allow read, update, delete: if isAdmin();
    }
    match /appointments/{id} {
      allow read: if request.auth != null;
      allow create: if isAdmin();
      allow update, delete: if isAdmin() || (request.auth != null && resource.data.clientUid == request.auth.uid);
    }
    match /settings/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /referrals/{id} {
      allow create: if request.auth != null;
      allow read, delete: if isAdmin();
    }
  }
}
```

Tieto pravidlá znamenajú: klientka vidí a upravuje len svoj vlastný
záznam a len tie svoje termíny, ktoré si sama vytvorila; ktokoľvek
prihlásený môže odoslať rezerváciu alebo odporúčanie; len účet označený
ako admin (krok 4) vidí a spravuje všetky klientky, žiadosti a termíny;
cenník vidí každý, upravovať ho môže len admin.

**Ak si tieto pravidlá ešte nepublikoval presne v tejto podobe**, otvor
Rules znova, prekopíruj celý text vyššie a klikni Publish — inak niektoré
funkcie (napr. zrušenie vlastného termínu klientkou) nebudú fungovať.

## 3. Zapnutie prihlasovania (Email/Password)

1. **Build → Authentication → Get started**.
2. V zozname poskytovateľov klikni **Email/Password**.
3. Zapni prepínač **Enable** a klikni **Save**.

## 4. Založenie admin účtu pre Michaelu

Appka toto nerobí sama (aby si nikto cudzí nemohol len tak zaregistrovať
admin prístup). Urob to ručne:

1. **Authentication → Users → Add user** — zadaj Michaelin email a heslo.
2. Skopíruj jej **User UID** z tabuľky používateľov.
3. **Firestore Database → Data → Start collection** → názov `admins`
   (presne s "s" na konci).
4. Ako **Document ID** vlož skopírované User UID (cez Ctrl+V, nie ručne
   napísané — jeden preklep a admin prístup nebude fungovať).
5. Priraď ľubovoľné pole (napr. `role`, typ string, hodnota `admin`)
   a ulož.

Od tejto chvíle sa Michaela prihlási cez tlačidlo **"Som Michaela"**
presne tým emailom a heslom, čo si jej založil.

## 5. Nahrávanie zmien na GitHub

Vždy rovnaký postup:
1. Rozbaľ nový zip do **úplne prázdneho/nového priečinka** (najisto: zmaž
   starý priečinok `aura-pwa` a rozbaľ znova, nech sa nezmiešajú staré
   a nové súbory).
2. Na GitHube v priečinku `app/` → **Add file → Upload files**.
3. Otvor obsah rozbaleného priečinka, **Ctrl+A** (označiť všetky súbory),
   pretiahni **súbory** (nie priečinok samotný) do okna na nahrávanie.
4. V náhľade skontroluj, že cesty NEMAJÚ `aura-pwa/` na začiatku.
5. **Commit changes**.
6. Over si to na `www.auranails.sk/app` — ak vidíš starú verziu, skús
   tvrdé obnovenie (Ctrl+Shift+R) alebo počkaj pár minút (GitHub Pages
   niekedy potrebuje chvíľu na vypublikovanie).

## Kompletný prehľad funkcií appky

### Klientka
- Registrácia a prihlásenie (email + heslo), obnova zabudnutého hesla
- Rezervácia termínu: vyberie službu, potom deň a čas na jednej
  obrazovke — hneď vidí, ktoré časy sú v daný deň voľné/obsadené; ak je
  deň plný, appka ponúkne najbližší voľný deň
- Vlastné nadchádzajúce termíny: zrušenie alebo zmena dátumu/času
- História návštev: tlačidlo "Rezervovať znova" (predvyplní rovnakú
  službu) a hodnotenie návštevy 1–5 hviezdičkami
- Aura Pass — vernostné pečiatky (zdieľané naživo s tým, čo vidí aj
  Michaela pri danej klientke)
- Cenník (len na čítanie)
- Odporúčací program — pri registrácii môže vyplniť, kto ju odporučil;
  po schválení Michaelou dostanú obe klientky +1 pečiatku
- Profil: dátum narodenia (narodeninová zľava sa zobrazí v deň D),
  nastavenie pripomienok (zatiaľ len vizuálne prepínače)

### Michaela (admin)
- Prehľad: kalendár obsadenosti (30 dní dopredu), termíny vybraného dňa,
  nastavenie voľna/zatvorenia (celý deň alebo konkrétny čas), karta
  s nadchádzajúcimi narodeninami klientok
- Žiadosti: schválenie/zamietnutie rezervácií s možnosťou upraviť
  trvanie pred potvrdením; schvaľovanie odporúčaní
- Klientky: pridanie, úprava, zmazanie, vyhľadávanie (meno/email/telefón),
  zlúčenie duplicitných záznamov (s poistkou proti zmazaniu účtu
  s prihlásením), správa termínov priamo v detaile klientky (pridať/
  upraviť/zrušiť), Aura Pass pečiatky, poznámky, história návštev
- Cenník: pridávanie, úprava aj mazanie kategórií a jednotlivých služieb
  — zmeny sa hneď zobrazia klientkam
- Štatistiky: termíny za týždeň/mesiac, počet klientok, priemer návštev,
  najobľúbenejšie služby, priemerné hodnotenie návštev, záloha klientok
  do CSV súboru

### Web (mimo appky)
- `stiahnut.html` — stránka s návodom na inštaláciu pre iPhone aj
  Android, vrátane QR kódu na priame otvorenie appky
- Plávajúce tlačidlo "Stiahnuť appku" na hlavnej stránke webu

## Čo (zatiaľ) chýba

- Skutočné SMS/e-mailové pripomienky pred termínom — prepínače v profile
  klientky sú zatiaľ len vizuálne, nič neposielajú (vyžadovalo by to
  ďalšiu službu ako Twilio alebo Firebase Extensions)
- Čakacia listina na plné dni
- Opakujúce sa voľno (napr. "každú nedeľu zatvorené" na jedno kliknutie)
  — teraz sa voľno nastavuje vždy pre jeden konkrétny deň
- Klientky pridané ručne Michaelou (napr. telefonické objednávky) nemajú
  vlastný prihlasovací účet — to je v poriadku, sú to "papierové"
  záznamy, kým si klientka sama nezaloží účet (dajú sa neskôr zlúčiť
  tlačidlom "Zlúčiť s inou klientkou")
