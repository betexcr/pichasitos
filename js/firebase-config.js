// Firebase client configuration for pichasitos.surge.sh
//
// This is a CLIENT-SIDE config (not a secret). Database security is
// enforced by Firebase Security Rules in the Firebase Console.
//
// To enable the online scoreboard:
//   1. Create a Firebase project at https://console.firebase.google.com
//   2. Enable Realtime Database (Start in test mode, then lock down)
//   3. Replace the empty strings below with your project's config
//   4. Deploy recommended database rules:
//      {
//        "rules": {
//          "scores": {
//            ".read": true,
//            ".write": true,
//            ".indexOn": ["score"]
//          },
//          "presence": {
//            ".read": true,
//            "$uid": { ".write": true }
//          }
//        }
//      }
//
// If left empty, the game falls back to local-only scores.

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAG2M6F0XGqkz7g82yPRDFxaUEz_5NdzRQ",
  authDomain: "pichasitos-arcade.firebaseapp.com",
  databaseURL: "https://pichasitos-arcade-default-rtdb.firebaseio.com",
  projectId: "pichasitos-arcade",
  storageBucket: "pichasitos-arcade.firebasestorage.app",
  messagingSenderId: "100015174798",
  appId: "1:100015174798:web:a907af221e2ca062aa45df"
};
