const ROWS = [
  { label: "READING", width: "100%",  opacity: "opacity-90" },
  { label: "COFFEE",  width: "96%",   opacity: "opacity-75" },
  { label: "FLAVOR",  width: "98%",   opacity: "opacity-80" },
  { label: "NEXUS",   width: "88%",   opacity: "opacity-60", tail: "∞" },
];

export default function LifeGantt() {
  return (
    <div className="w-full rounded-xl border border-[#8A6F5C]/20 bg-[#EEE9E2] px-4 py-4 font-mono">
      {/* Year axis */}
      <div className="mb-2 flex items-center justify-between text-[9px] text-[#8A6F5C] tracking-widest uppercase">
        <span>2018</span>
        <span className="text-[10px] font-semibold text-[#1A2B4A]">Day 2,922</span>
        <span>2026 ►</span>
      </div>

      {/* Gantt rows */}
      <div className="space-y-2 relative">
        {/* Vertical marker at ~Day 2922 (≈ 100% since we're at the end) */}
        <div
          className="absolute top-0 bottom-0 w-px bg-[#3B82C4]/40 pointer-events-none"
          style={{ right: "0%" }}
        />

        {ROWS.map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-[9px] text-[#8A6F5C] tracking-widest uppercase text-right">
              {row.label}
            </span>
            <div className="relative flex-1 h-4 flex items-center">
              <div
                className={`h-2.5 rounded-sm bg-[#1A2B4A] ${row.opacity} transition-all`}
                style={{ width: row.width }}
              />
              {row.tail && (
                <span className="ml-1 text-[11px] font-semibold text-[#1A2B4A]">
                  {row.tail}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
