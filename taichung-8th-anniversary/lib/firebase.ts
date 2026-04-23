import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Lazy init — 避免在 Next.js build 時因缺少環境變數而崩潰
export function getFirebaseAuth() {
  const app =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          apiKey:     process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
          projectId:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
        });
  return getAuth(app);
}
