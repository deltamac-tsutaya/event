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
  apiKey: "AIzaSyByGQiiKY1CjLOCyyzRXmeVR012HKTVDqQ",
  authDomain: "daffy-queue.firebaseapp.com",
  databaseURL: "https://daffy-queue-default-rtdb.firebaseio.com",
  projectId: "daffy-queue",
  storageBucket: "daffy-queue.firebasestorage.app",
  messagingSenderId: "750628552909",
  appId: "1:750628552909:web:1a889475dae9f3622f6984"
};

export const ADMIN_PASSWORD = "daffy2026";

export const QUEUE_PATH = "queue/current";
