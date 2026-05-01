import { mockStores } from "@/lib/mockData";
import { Divider } from "@/components/common/Divider";
import Button from "@/components/common/Button";
import { Card, CardTitle } from "@/components/common/Card";

export const metadata = {
  title: "店舖篩選｜À LA PAGE",
  description: "探索 TSUTAYA BOOKSTORE × WIRED TOKYO 各地店舖的活動與餐飲優惠。",
};

export default function StoresPage() {
  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="py-16 md:py-24 px-4 bg-black text-cream">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-widest mb-4 opacity-60">
            店舖活動
          </p>
          <h1 className="text-h1-sm md:text-h1-md font-serif font-bold mb-6">
            找到您附近的第三空間
          </h1>
          <Divider variant="gold" spacing="md" fullWidth={true} />
          <p className="text-body mt-8 text-gray-light">
            À LA PAGE 與全台灣的書店、咖啡廳與創意空間合作，為您帶來分散式的第三空間體驗。
          </p>
        </div>
      </section>

      {/* Stores Grid */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockStores.map((store) => (
              <Card
                key={store.id}
                className="hover:border-green-ink transition overflow-hidden"
                variant="default"
              >
                {store.image && (
                  <div className="w-full h-48 bg-gray-light overflow-hidden -m-6 mb-6">
                    <img
                      src={store.image.url}
                      alt={store.image.alt}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                )}

                <div className="px-6 pb-6">
                  <CardTitle className="text-h3-md font-serif font-bold text-black mb-4">
                    {store.name}
                  </CardTitle>

                  <div className="space-y-4 mb-6">
                    {/* Address */}
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-dark mb-2">
                        地址
                      </p>
                      <p className="text-sm text-black">{store.address}</p>
                    </div>

                    {/* Hours */}
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-dark mb-2">
                        營業時間
                      </p>
                      <p className="text-sm text-black">{store.openingHours}</p>
                    </div>

                    {/* Phone */}
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-dark mb-2">
                        聯絡電話
                      </p>
                      <a
                        href={`tel:${store.phone}`}
                        className="text-sm text-green-ink hover:text-black transition"
                      >
                        {store.phone}
                      </a>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-sm text-gray-dark leading-relaxed">
                        {store.description}
                      </p>
                    </div>
                  </div>

                  <Button
                    href={`/issues?store=${store.code}`}
                    asChild
                    size="md"
                    variant="primary"
                    className="w-full"
                  >
                    查看此店舖活動
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-cream">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-h2-md font-serif font-bold text-black mb-6">
            想在您的店舖舉辦活動？
          </h2>
          <p className="text-body text-gray-dark mb-8">
            À LA PAGE 歡迎與各地的獨立書店、咖啡廳、創意空間合作，共同打造第三空間的文化體驗。
          </p>
          <Button href="/collaboration" asChild size="lg" variant="primary">
            申請合作
          </Button>
        </div>
      </section>
    </main>
  );
}
