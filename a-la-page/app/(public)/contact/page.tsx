import { Divider } from "@/components/common/Divider";
import Button from "@/components/common/Button";
import { Card, CardTitle } from "@/components/common/Card";

export const metadata = {
  title: "聯絡資訊｜À LA PAGE",
  description: "聯繫 À LA PAGE - TSUTAYA BOOKSTORE × WIRED TOKYO 數位第三空間的聯絡方式。",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="py-16 md:py-24 px-4 bg-black text-cream">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-widest mb-4 opacity-60">
            聯絡我們
          </p>
          <h1 className="text-h1-sm md:text-h1-md font-serif font-bold mb-6">
            與我們保持聯繫
          </h1>
          <Divider variant="gold" spacing="md" fullWidth={true} />
          <p className="text-body mt-8 text-gray-light">
            有任何建議、合作機會或問題想詢問？我們很樂意聽取您的意見。
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Headquarters */}
            <Card className="hover:border-green-ink transition" variant="default">
              <CardTitle className="text-h3-md font-serif font-bold text-black mb-6">
                總部
              </CardTitle>

              <div className="space-y-6">
                {/* Address */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-dark mb-3">
                    地址
                  </p>
                  <address className="text-sm text-black not-italic">
                    台北市信義區信義路五段 100 號 3F
                    <br />
                    TSUTAYA BOOKSTORE × WIRED TOKYO
                  </address>
                </div>

                {/* Hours */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-dark mb-3">
                    營業時間
                  </p>
                  <p className="text-sm text-black">
                    週一至週日：10:00 - 22:00
                    <br />
                    （國定假日照常營業）
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-dark mb-3">
                    電話
                  </p>
                  <a
                    href="tel:+886-2-XXXX-XXXX"
                    className="text-sm text-green-ink hover:text-black transition"
                  >
                    +886-2-XXXX-XXXX
                  </a>
                </div>
              </div>
            </Card>

            {/* Email */}
            <Card className="hover:border-green-ink transition" variant="default">
              <CardTitle className="text-h3-md font-serif font-bold text-black mb-6">
                電子郵件
              </CardTitle>

              <div className="space-y-6">
                {/* General */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-dark mb-3">
                    一般諮詢
                  </p>
                  <a
                    href="mailto:info@a-la-page.tw"
                    className="text-sm text-green-ink hover:text-black transition break-all"
                  >
                    info@a-la-page.tw
                  </a>
                </div>

                {/* Partnership */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-dark mb-3">
                    合作機會
                  </p>
                  <a
                    href="mailto:partnership@a-la-page.tw"
                    className="text-sm text-green-ink hover:text-black transition break-all"
                  >
                    partnership@a-la-page.tw
                  </a>
                </div>

                {/* Press */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-dark mb-3">
                    媒體詢問
                  </p>
                  <a
                    href="mailto:press@a-la-page.tw"
                    className="text-sm text-green-ink hover:text-black transition break-all"
                  >
                    press@a-la-page.tw
                  </a>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card className="hover:border-green-ink transition" variant="default">
              <CardTitle className="text-h3-md font-serif font-bold text-black mb-6">
                追蹤我們
              </CardTitle>

              <div className="space-y-6">
                {/* LINE */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-dark mb-3">
                    LINE Official Account
                  </p>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-ink hover:text-black transition"
                  >
                    @a-la-page
                  </a>
                </div>

                {/* Instagram */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-dark mb-3">
                    Instagram
                  </p>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-ink hover:text-black transition"
                  >
                    @a.la.page
                  </a>
                </div>

                {/* Facebook */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-dark mb-3">
                    Facebook
                  </p>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-ink hover:text-black transition"
                  >
                    À LA PAGE
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 bg-cream">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-h2-md font-serif font-bold text-black mb-12">
            常見問題
          </h2>

          <div className="space-y-8">
            {/* Q1 */}
            <div>
              <h3 className="text-h3-md font-bold text-black mb-3">
                À LA PAGE 是什麼？
              </h3>
              <p className="text-sm text-gray-dark">
                À LA PAGE
                是 TSUTAYA BOOKSTORE × WIRED TOKYO
                的數位第三空間，每月發行一期線上月刊，策展食物、書籍、電影與生活提案。
              </p>
            </div>

            {/* Q2 */}
            <div>
              <h3 className="text-h3-md font-bold text-black mb-3">
                如何報名活動？
              </h3>
              <p className="text-sm text-gray-dark">
                在各活動詳情頁面有「立即報名」按鈕，點擊後會導向報名連結。您也可以透過
                LINE OA 或店舖現場報名。
              </p>
            </div>

            {/* Q3 */}
            <div>
              <h3 className="text-h3-md font-bold text-black mb-3">
                如何與 À LA PAGE 合作？
              </h3>
              <p className="text-sm text-gray-dark">
                我們歡迎各種形式的合作機會。請前往「合作申請」頁面填寫申請表，或直接寄送合作提案至
                partnership@a-la-page.tw。
              </p>
            </div>

            {/* Q4 */}
            <div>
              <h3 className="text-h3-md font-bold text-black mb-3">
                我可以在其他城市參加活動嗎？
              </h3>
              <p className="text-sm text-gray-dark">
                À LA PAGE
                與台灣各地的書店、咖啡廳和創意空間合作。您可以透過「店舖」頁面查看各地合作場所。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-h2-md font-serif font-bold text-black mb-6">
            準備好探索更多？
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button href="/" asChild size="lg" variant="primary">
              返回首頁
            </Button>
            <Button href="/issues" asChild size="lg" variant="ghost">
              瀏覽月刊
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
