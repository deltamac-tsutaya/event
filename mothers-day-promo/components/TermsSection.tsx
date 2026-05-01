const terms = [
  "活動商品、折扣與贈品數量依現場庫存為準，售完為止。",
  "優惠不得與其他折扣、折價券及會員優惠合併使用，另有規定者依現場公告為準。",
  "贈品數量有限，送完為止，恕不另行通知。",
  "酒類商品請依門市販售規範購買。未滿十八歲請勿飲酒，禁止酒駕。",
  "部分品牌活動期間與適用門市不同，請依各活動說明或現場標示為準。",
  "TSUTAYA BOOKSTORE 保留活動調整與最終解釋權。",
];

export default function TermsSection() {
  return (
    <section className="py-14 px-4" style={{ background: "#F2EAE0" }}>
      <div className="max-w-2xl mx-auto">
        <h2
          className="font-serif text-xl font-bold text-center mb-2"
          style={{ color: "#1C1410" }}
        >
          活動注意事項
        </h2>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div style={{ width: 32, height: 1, background: "#C8845E", opacity: 0.4 }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C8845E", opacity: 0.5 }} />
          <div style={{ width: 32, height: 1, background: "#C8845E", opacity: 0.4 }} />
        </div>
        <ul className="list-none flex flex-col gap-3">
          {terms.map((term, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm leading-relaxed"
              style={{ color: "#5A4030" }}
            >
              <span
                className="flex-shrink-0 mt-1.5"
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#C8845E",
                  opacity: 0.7,
                  display: "block",
                  flexShrink: 0,
                }}
              />
              {term}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
