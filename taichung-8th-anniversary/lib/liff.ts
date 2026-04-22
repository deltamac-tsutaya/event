import liff from "@line/liff";

let initialized = false;

export const MOCK_USER = {
  userId: process.env.NEXT_PUBLIC_TEST_LINE_USER_ID ?? "U_mock_test_user_001",
  displayName: process.env.NEXT_PUBLIC_TEST_DISPLAY_NAME ?? "Mock User",
  pictureUrl: undefined as string | undefined,
};

export async function initLiff(liffId: string): Promise<void> {
  if (initialized) return;
  await liff.init({ liffId });
  initialized = true;
}

export async function getLiffProfile() {
  if (!liff.isLoggedIn()) return null;
  return liff.getProfile();
}

export function isLiffLoggedIn(): boolean {
  return initialized && liff.isLoggedIn();
}

export function isLiffReady(): boolean {
  return initialized;
}

export function loginWithLiff(): void {
  if (initialized && !liff.isLoggedIn()) {
    liff.login();
  }
}

/**
 * scanCodeV2 でQRコードをスキャン。非対応環境では null を返す。
 */
export async function scanQrCode(): Promise<string | null> {
  if (!initialized) return null;
  if (!liff.scanCodeV2) return null;
  try {
    const result = await liff.scanCodeV2();
    return result?.value ?? null;
  } catch {
    return null;
  }
}

export { liff };
