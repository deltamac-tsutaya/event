const STEPS = [
  {
    number: "01",
    title: "LINE 帳號登入",
    desc: "點擊登入，以 LINE 帳號授權",
  },
  {
    number: "02",
    title: "掃描 QR code",
    desc: "掃描店內 8 個集印點的 QR code",
  },
  {
    number: "03",
    title: "每日抽獎",
    desc: "集滿 8 枚印章，每日可抽一次獎",
  },
];

export default function StepFlow() {
  return (
    <div className="flex items-start justify-between gap-2">
      {STEPS.map((step, idx) => (
        <div key={step.number} className="flex flex-1 items-start gap-1">
          {/* Step card */}
          <div className="flex flex-1 flex-col items-center gap-1.5 rounded-xl bg-[#EEE9E2] px-2 py-3 text-center">
            <span className="font-mono text-lg font-bold text-[#1A2B4A] leading-none">
              {step.number}
            </span>
            <span className="text-xs font-semibold text-gray-800 leading-tight">
              {step.title}
            </span>
            <span className="text-[10px] text-gray-500 leading-tight">
              {step.desc}
            </span>
          </div>

          {/* Arrow between steps */}
          {idx < STEPS.length - 1 && (
            <div className="mt-6 shrink-0 text-gray-300 text-lg leading-none">
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
