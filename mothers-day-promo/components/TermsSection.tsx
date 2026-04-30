const terms = [
  "活動商品、折扣與贈品數量依現場庫存為準，售完為止。",
  "優惠不得與其他折扣、折價券及會員優惠合併使用，另有規定者依現場公告為準。",
  "贈品數量有限，贈完為止，恕不另行通知。",
  "酒類商品請依門市販售規範執行，未滿十八歲請勿飲酒。",
  "部分品牌活動期間與適用門市不同，請依各活動說明或現場標示為準。",
  "活動最終解釋權歸 TSUTAYA BOOKSTORE 所有，如有任何調整，以門市公告為準。",
];

export default function TermsSection() {
  return (
    <section className="py-16 px-4 relative overflow-hidden" style={{ background: "#F5EDE0" }}>
      {/* Subtle background texture circles */}
      <div
        className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,132,94,0.1), transparent 70%)" }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-[11px] tracking-[0.22em] uppercase mb-2" style={{ color: "#C8845E" }}>
            注意事項
          </p>
          <h2
            className="font-serif text-xl font-bold"
            style={{ color: "#3D2B1F" }}
          >
            活動注意事項
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div style={{ width: 40, height: 1, background: "linear-gradient(to left, #C8845E, transparent)", opacity: 0.5 }} />
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C8845E", opacity: 0.5 }} />
            <div style={{ width: 40, height: 1, background: "linear-gradient(to right, #C8845E, transparent)", opacity: 0.5 }} />
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          {terms.map((term, i) => (
            <li
              key={i}
              className="flex items-start gap-3.5 text-sm leading-relaxed py-3 px-4 rounded-xl"
              style={{ background: "rgba(253,248,242,0.7)", color: "#6B5040" }}
            >
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                style={{ background: "linear-gradient(135deg, #C8845E, #E09470)", color: "#FDF8F2" }}
              >
                {i + 1}
              </span>
              {term}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
