import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let rtdb: Database | null = null;
let auth: Auth | null = null;

const isConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

if (isConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    rtdb = getDatabase(app);
    auth = getAuth(app);
  } catch (e) {
    console.error("Could not initialize Firebase. Please check your configuration.", e);
    // Fallback to null if initialization fails
    app = null;
    rtdb = null;
    auth = null;
  }
} else {
    console.warn("Firebase configuration is missing in environment variables. Firebase features will be disabled.");
}


export { app, rtdb, auth };
