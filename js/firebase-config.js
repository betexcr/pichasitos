// Firebase client configuration for PICHASITOS.
//
// This is a CLIENT-SIDE config (not a secret). Database security is
// enforced by Firebase Security Rules (see database.rules.json).
//
// Hosting project (.firebaserc "hosting"): pichasitos
// RTDB project (.firebaserc "database" / this config): pichasitos-arcade
//
// To enable the online scoreboard:
//   1. Enable Anonymous Auth in Firebase Console (Authentication)
//   2. Enable Realtime Database
//   3. Deploy rules: firebase deploy --only database --project pichasitos-arcade
//   4. Optional App Check: set appCheckSiteKey to your reCAPTCHA v3 site key
//   5. Optional errorBeacon: true to mirror loop errors to RTDB clientErrors
//
// Rules require auth != null, validated payloads, and presence writes only to auth.uid.
// If databaseURL is empty, the game falls back to local-only scores.

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAG2M6F0XGqkz7g82yPRDFxaUEz_5NdzRQ",
  authDomain: "pichasitos-arcade.firebaseapp.com",
  databaseURL: "https://pichasitos-arcade-default-rtdb.firebaseio.com",
  projectId: "pichasitos-arcade",
  storageBucket: "pichasitos-arcade.firebasestorage.app",
  messagingSenderId: "100015174798",
  appId: "1:100015174798:web:a907af221e2ca062aa45df",
  // Optional: reCAPTCHA v3 site key for App Check (leave empty to skip)
  appCheckSiteKey: "",
  // Optional: mirror Logger.error to RTDB clientErrors (requires Auth)
  errorBeacon: false
};
