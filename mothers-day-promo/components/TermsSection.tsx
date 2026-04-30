const terms = [
  "活動商品、折扣與贈品數量依現場庫存為準，售完為止。",
  "優惠不得與其他折扣、折價券及會員優惠合併使用，另有規定者依現場公告為準。",
  "贈品數量有限，贈完為止，恕不提前告知。",
  "部分品牌活動期間與適用門市不同，請依各活動說明或現場標示為準。",
  "酒類商品請依門市販售規範執行，未滿十八歲請勿飲酒。",
  "活動最終解釋權歸 TSUTAYA BOOKSTORE 所有，如有任何調整，以門市公告為準。",
];

export default function TermsSection() {
  return (
    <section
      className="py-14 px-4"
      style={{ background: "#F5EDE0" }}
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-lg font-bold text-center mb-6"
          style={{ color: "#3D2B1F" }}
        >
          活動注意事項
        </h2>
        <ul className="flex flex-col gap-3">
          {terms.map((term, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm leading-relaxed"
              style={{ color: "#6B5040" }}
            >
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: "#C8845E", color: "#FDF8F2" }}
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
