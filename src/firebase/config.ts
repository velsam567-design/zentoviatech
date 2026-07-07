import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZvH_BYNGmc6VZPmdy-rrdJfKzWHAQVbE",
  authDomain: "honeybadgertech-73c63.firebaseapp.com",
  databaseURL:
    "https://honeybadgertech-73c63-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "honeybadgertech-73c63",
  storageBucket: "honeybadgertech-73c63.firebasestorage.app",
  messagingSenderId: "1001606506373",
  appId: "1:1001606506373:web:b4751f8354ab6e7fc406ec",
  measurementId: "G-7Y45498LYM",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;