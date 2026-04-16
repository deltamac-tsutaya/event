import liff from "@line/liff";

let initialized = false;

export async function initLiff(liffId: string): Promise<void> {
  if (initialized) return;
  await liff.init({ liffId });
  initialized = true;
}

export async function getLiffProfile() {
  if (!liff.isLoggedIn()) return null;
  return liff.getProfile();
}

export function isLiffReady(): boolean {
  return initialized;
}

/**
 * scanCodeV2 を使ってQRコードをスキャン。
 * 非対応環境では null を返す。
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
