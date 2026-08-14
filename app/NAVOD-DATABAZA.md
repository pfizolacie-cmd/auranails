# Návod: databáza + prihlasovanie (Firebase)

Appka teraz namiesto dočasnej pamäte prehliadača používa **Firebase
Firestore** (databáza) a **Firebase Authentication** (prihlasovanie).
Klientky sa registrujú menom, emailom a heslom. Michaela sa prihlasuje
samostatným účtom, ktorý jej založíš ty.

## 1. Založenie Firebase projektu

Toto už máš hotové (projekt `aura-nails-kalendar`).

## 2. Zapnutie Firestore databázy

Toto už máš hotové — over si len, že v Firestore Database → **Rules** je
publikovaný tento text (nahraď čím ostane a klikni Publish):

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
      allow read, write: if request.auth != null && request.auth.uid == id;
      allow read, write: if isAdmin();
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
  }
}
```

Tieto pravidlá znamenajú: klientka vidí a upravuje len svoj vlastný záznam;
ktokoľvek prihlásený môže odoslať rezerváciu; len účet označený ako admin
(pozri krok 4) vidí a spravuje všetky klientky, žiadosti a termíny; cenník
vidí každý, ale upravovať ho môže len admin; klientka si môže sama zrušiť
alebo presunúť len tie termíny, ktoré si sama vytvorila cez svoj účet.

**Ak si pravidlá publikoval už predtým** (bez riadku `allow create: if isAdmin();`
pri `appointments`), treba ich znova otvoriť, prekopírovať celý text vyššie
a znova kliknúť Publish — inak si klientka nebude vedieť zrušiť/presunúť
vlastný termín.

## 3. Zapnutie prihlasovania (Email/Password)

1. V ľavom menu klikni **Build → Authentication**.
2. Klikni **"Get started"**.
3. V zozname poskytovateľov klikni na **"Email/Password"**.
4. Zapni prepínač **"Enable"** a klikni **Save**.

## 4. Založenie admin účtu pre Michaelu

Toto appka nerobí sama (aby si niekto cudzí nemohol len tak zaregistrovať
admin prístup). Urob to ručne:

1. V **Authentication → Users** klikni **"Add user"**.
2. Zadaj Michaelin email a heslo, ktorým sa bude prihlasovať do appky, a
   klikni **Add user**.
3. V zozname používateľov sa objaví jej účet — skopíruj jej **User UID**
   (dlhý kód, klikni na riadok alebo na ikonu kopírovania).
4. Choď do **Firestore Database → Data** a klikni **"Start collection"**.
5. Názov kolekcie: `admins`.
6. Ako **Document ID** vlož presne skopírované User UID.
7. Pridaj ľubovoľné pole, napr. `role` (typ string) s hodnotou `admin`, a
   ulož.

Od tejto chvíle sa Michaela v appke prihlási cez tlačidlo **"Som Michaela"**
presne tým emailom a heslom, čo si jej založil.

## 5. Nahratie súborov na GitHub

Rovnako ako predtým — nahraď obsah priečinka `app/` v repozitári
`pfizolacie-cmd/auranails` novými súbormi (najmä `app.jsx`, `index.html`).

## Ako to teraz funguje

- **Klientka**: na úvodnej obrazovke klikne "Som klientka" → môže sa buď
  prihlásiť (email + heslo), alebo si cez odkaz "Nemáte účet? Zaregistrujte
  sa" vytvoriť nový účet (meno, email, heslo). Po registrácii appka rovno
  vytvorí jej záznam v databáze a je prihlásená.
- **Michaela**: klikne "Som Michaela" → zadá email a heslo, ktoré si jej
  založil v kroku 4. Ak by sa náhodou prihlásil bežný (neadmin) účet cez
  tento formulár, appka ho odhlási a ukáže hlásenie, že nemá admin prístup.
- Odhlásenie: šípka vľavo hore v appke (v hlavičke) teraz reálne odhlasuje
  z účtu, nie je to len návrat na predchádzajúcu obrazovku.
- Rezervácia klientky sa ukladá s odkazom na jej účet, takže vidí len svoje
  vlastné nadchádzajúce termíny a históriu.

## Čo (zatiaľ) chýba

- Obnovenie zabudnutého hesla ("Zabudli ste heslo?") appka zatiaľ nemá —
  dá sa doplniť, ak to bude treba.
- SMS/e-mailové pripomienky nie sú zapojené — prepínače v appke sú zatiaľ
  len vizuálne.
- Klientky pridané ručne Michaelou (bez registrácie, napr. telefonické
  objednávky) nemajú vlastný prihlasovací účet — to je v poriadku, sú to
  "papierové" záznamy, kým si klientka sama nezaloží účet.
