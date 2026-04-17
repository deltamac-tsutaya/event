"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface QrScannerProps {
  onScan: (stampId: string) => void;
}

type ScanState = "idle" | "scanning" | "error";

export default function QrScanner({ onScan }: QrScannerProps) {
  const [state, setState] = useState<ScanState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const html5QrRef = useRef<InstanceType<
    typeof import("html5-qrcode").Html5Qrcode
  > | null>(null);
  const scannerDivId = "html5-qr-region";

  const stopHtml5Scanner = useCallback(async () => {
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop();
        html5QrRef.current.clear();
      } catch {
        // ignore
      }
      html5QrRef.current = null;
    }
  }, []);

  // Try LIFF scanCodeV2 first, fall back to html5-qrcode
  const startScan = useCallback(async () => {
    setState("scanning");
    setErrorMsg("");

    try {
      // Attempt LIFF scanCodeV2
      const { scanQrCode } = await import("@/lib/liff");
      const value = await scanQrCode();
      if (value !== null) {
        setState("idle");
        onScan(value);
        return;
      }
    } catch {
      // LIFF not available — fall through to html5-qrcode
    }

    // Fallback: html5-qrcode
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(scannerDivId);
      html5QrRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          stopHtml5Scanner().then(() => {
            setState("idle");
            onScan(decodedText);
          });
        },
        () => {
          /* scan frame error – ignore */
        }
      );
    } catch (err) {
      setState("error");
      setErrorMsg(
        err instanceof Error ? err.message : "無法啟動相機，請確認已授予鏡頭權限"
      );
    }
  }, [onScan, stopHtml5Scanner]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopHtml5Scanner();
    };
  }, [stopHtml5Scanner]);

  const handleCancel = useCallback(async () => {
    await stopHtml5Scanner();
    setState("idle");
    setErrorMsg("");
  }, [stopHtml5Scanner]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* html5-qrcode mount target */}
      <div
        id={scannerDivId}
        className={`w-full rounded-xl overflow-hidden ${
          state === "scanning" ? "block" : "hidden"
        }`}
      />

      {state === "idle" && (
        <Button
          onClick={startScan}
          className="w-full bg-[#1A2B4A] text-white hover:bg-[#1A2B4A]/90 h-12 text-base font-semibold"
        >
          掃描 QR code
        </Button>
      )}

      {state === "scanning" && (
        <div className="flex w-full flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="inline-block size-4 animate-spin rounded-full border-2 border-[#1A2B4A] border-t-transparent" />
            掃描中，請對準 QR code…
          </div>
          <Button variant="outline" onClick={handleCancel} className="w-full">
            取消
          </Button>
        </div>
      )}

      {state === "error" && (
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-sm text-red-600 text-center">{errorMsg}</p>
          <Button
            onClick={startScan}
            className="w-full bg-[#1A2B4A] text-white hover:bg-[#1A2B4A]/90"
          >
            重試
          </Button>
        </div>
      )}
    </div>
  );
}
