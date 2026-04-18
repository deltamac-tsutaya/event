// ---------------------------------------------------------------
// Daffy POPUP queue display — configuration
// ---------------------------------------------------------------
// 1. Replace the Firebase config below with your own project's
//    Realtime Database credentials (Firebase Console → Project
//    settings → SDK setup and configuration).
// 2. Change ADMIN_PASSWORD to the shared staff password.
//    NOTE: this is client-side only and protects the UI, not the
//    database. Set database rules in Firebase to restrict writes
//    (see README.md).
// 3. Optional: change QUEUE_PATH if you want to namespace the
//    number (e.g. per event day).
// ---------------------------------------------------------------

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "0000000000",
  appId: "1:0000000000:web:xxxxxxxxxxxxxxxxxxxxxx"
};

export const ADMIN_PASSWORD = "daffy2026";

export const QUEUE_PATH = "queue/current";
