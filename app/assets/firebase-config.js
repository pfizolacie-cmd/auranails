import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDALdC08ZULv_i_WydPr6pe2d0riO4q3ic",
  authDomain: "aura-nails-kalendar.firebaseapp.com",
  databaseURL: "https://aura-nails-kalendar-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "aura-nails-kalendar",
  storageBucket: "aura-nails-kalendar.firebasestorage.app",
  messagingSenderId: "45357190349",
  appId: "1:45357190349:web:40b9871fcd3e3cc963ad84",
  measurementId: "G-HZK5XRS2CD"
};

// Inicializácia Firebase
const app = initializeApp(firebaseConfig);

// Export databázy pre zvyšok aplikácie
export const db = getDatabase(app);
