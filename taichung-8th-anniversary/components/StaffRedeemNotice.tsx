export default function StaffRedeemNotice() {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900"
    >
      <span className="mt-0.5 text-xl leading-none" aria-hidden>⚠️</span>
      <p>
        <span className="font-bold">注意：</span>
        獎券核銷請交由現場工作人員操作，顧客請勿自行點擊核銷，
        <span className="font-semibold underline decoration-yellow-500">
          誤點視同已使用
        </span>
        。
      </p>
    </div>
  );
}
