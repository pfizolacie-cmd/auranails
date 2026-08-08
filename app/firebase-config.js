// Sem vlož konfiguráciu z Firebase konzoly (Project settings → Your apps → SDK setup and configuration).
// Tieto hodnoty NIE sú tajné heslo — je normálne, že sú viditeľné vo verejnom kóde appky.
// Skutočná ochrana dát je nastavená cez Firestore Security Rules (pozri NAVOD-DATABAZA.md).

window.firebaseConfig = {
  apiKey: "VLOZ_SEM_API_KEY",
  authDomain: "VLOZ_SEM_AUTH_DOMAIN",
  projectId: "VLOZ_SEM_PROJECT_ID",
  storageBucket: "VLOZ_SEM_STORAGE_BUCKET",
  messagingSenderId: "VLOZ_SEM_SENDER_ID",
  appId: "VLOZ_SEM_APP_ID"
};
