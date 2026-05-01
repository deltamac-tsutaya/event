"use client";

import { FormEvent, useState } from "react";
import { Divider } from "@/components/common/Divider";
import Button from "@/components/common/Button";

export default function CollaborationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 3000);
  };

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="py-16 md:py-24 px-4 bg-black text-cream">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-widest mb-4 opacity-60">
            合作機會
          </p>
          <h1 className="text-h1-sm md:text-h1-md font-serif font-bold mb-6">
            與 À LA PAGE 合作
          </h1>
          <Divider variant="gold" spacing="md" fullWidth={true} />
          <p className="text-body mt-8 text-gray-light">
            我們尋找志同道合的品牌與空間，共同創造生活風格的策展體驗。無論您是書店、咖啡廳、電影院還是創意工作室，都歡迎與我們聯繫。
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Info */}
            <div>
              <h2 className="text-h2-md font-serif font-bold text-black mb-6">
                合作類型
              </h2>

              <div className="space-y-8">
                {/* Type 1 */}
                <div>
                  <h3 className="text-h3-md font-bold text-black mb-2">
                    活動合作
                  </h3>
                  <p className="text-sm text-gray-dark">
                    在您的場所舉辦工作坊、讀書會、放映會或其他文化活動，與 À LA PAGE
                    共同策展生活體驗。
                  </p>
                </div>

                {/* Type 2 */}
                <div>
                  <h3 className="text-h3-md font-bold text-black mb-2">
                    品牌合作
                  </h3>
                  <p className="text-sm text-gray-dark">
                    推出聯合企劃、限定商品或跨界合作，將您的品牌故事融入 À LA PAGE 的月刊策展。
                  </p>
                </div>

                {/* Type 3 */}
                <div>
                  <h3 className="text-h3-md font-bold text-black mb-2">
                    內容授權
                  </h3>
                  <p className="text-sm text-gray-dark">
                    將您的活動、商品或服務納入 À LA PAGE 的月刊推介，以策展式的內容行銷觸及更廣泛的受眾。
                  </p>
                </div>
              </div>

              <Divider variant="gold" spacing="lg" fullWidth={true} />

              <h2 className="text-h2-md font-serif font-bold text-black mb-6 mt-8">
                為什麼選擇我們？
              </h2>

              <ul className="space-y-4 text-sm text-gray-dark">
                <li className="flex gap-3">
                  <span className="text-green-ink font-bold">✓</span>
                  <span>
                    月平均 2,000+ 獨特訪客，目標客群為都市知識工作者與文化愛好者
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-ink font-bold">✓</span>
                  <span>
                    雜誌式策展帶來高品質的內容環境與品牌關聯
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-ink font-bold">✓</span>
                  <span>
                    多元化的媒體曝光（官網、LINE OA、Instagram、Facebook）
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-ink font-bold">✓</span>
                  <span>
                    靈活的合作形式，從單次活動到年度企劃皆可協商
                  </span>
                </li>
              </ul>
            </div>

            {/* Right Column - Form */}
            <div className="bg-cream p-8 md:p-12">
              <h2 className="text-h2-md font-serif font-bold text-black mb-8">
                申請合作
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <p className="text-lg font-bold text-green-ink mb-4">
                    ✓ 感謝您的申請！
                  </p>
                  <p className="text-sm text-gray-dark">
                    我們已收到您的訊息，會在 3-5 個工作天內與您聯繫。
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold text-black mb-2"
                    >
                      姓名 / 品牌名稱
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-dark text-black placeholder-gray-dark focus:outline-none focus:border-black"
                      placeholder="您的姓名或品牌名稱"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-black mb-2"
                    >
                      電子郵件
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-dark text-black placeholder-gray-dark focus:outline-none focus:border-black"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-bold text-black mb-2"
                    >
                      聯絡電話
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-dark text-black placeholder-gray-dark focus:outline-none focus:border-black"
                      placeholder="+886-9XX-XXX-XXX"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-bold text-black mb-2"
                    >
                      合作類型
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      className="w-full px-4 py-3 border border-gray-dark text-black focus:outline-none focus:border-black"
                    >
                      <option value="">請選擇...</option>
                      <option value="event">活動合作</option>
                      <option value="brand">品牌合作</option>
                      <option value="content">內容授權</option>
                      <option value="other">其他</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-bold text-black mb-2"
                    >
                      合作提案
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full px-4 py-3 border border-gray-dark text-black placeholder-gray-dark focus:outline-none focus:border-black resize-none"
                      placeholder="請簡述您的合作想法和背景..."
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={loading}
                    isLoading={loading}
                    size="lg"
                    variant="primary"
                    className="w-full"
                  >
                    {loading ? "提交中..." : "提交申請"}
                  </Button>

                  <p className="text-xs text-gray-dark text-center">
                    我們重視您的隱私，申請資料將僅用於評估合作機會。
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
