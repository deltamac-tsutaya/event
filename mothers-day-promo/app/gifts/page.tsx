import type { Metadata } from "next";
import Layout from "@/components/site/Layout";
import SectionHead from "@/components/site/SectionHead";
import PromoCard from "@/components/site/PromoCard";
import { promotions, categoryMeta } from "@/lib/promotions";

export const metadata: Metadata = {
  title: "送禮推薦",
  description: "依品類瀏覽全部母親節送禮優惠：香氛保養、生活配件、茶咖酒禮盒、親子選品。",
  openGraph: {
    title: "送禮推薦 ・ 母親節特輯",
    description: "全品類母親節優惠一次掌握。",
  },
};

const order = ["fragrance", "tea-wine", "lifestyle", "family"] as const;

export default function GiftsPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-[1280px] px-5 md:px-10 pt-16 md:pt-24">
        <SectionHead
          index="02"
          en="The Gift Guide"
          zh="母 親 節 送 禮 推 薦"
          description="從香氛、身體保養、茶咖酒禮盒到日常配件，挑選一份能融入生活的禮物。"
        />
      </section>

      {order.map((catKey, ci) => {
        const items = promotions.filter((p) => p.category === catKey);
        const meta = categoryMeta[catKey];
        return (
          <section
            key={catKey}
            className={`mx-auto max-w-[1280px] px-5 md:px-10 py-20 md:py-28 ${
              ci % 2 === 1 ? "border-y border-rule bg-paper-deep/25" : ""
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-ink/80 pb-6">
              <div>
                <p className="num-index">CHAPTER ／ 0{ci + 1}</p>
                <h2 className="mt-3 font-serif-tc text-3xl md:text-5xl font-light tracking-[0.2em] text-ink">
                  {meta.title}
                </h2>
                <p className="mt-2 font-display italic tracking-[0.3em] text-ink-soft">
                  {meta.en}
                </p>
              </div>
              <p className="md:max-w-md text-sm leading-[2] text-ink-soft md:text-right">
                {meta.desc}
              </p>
            </div>
            <div>
              {items.map((p, i) => (
                <PromoCard key={p.id} promo={p} index={i + 1} />
              ))}
            </div>
          </section>
        );
      })}
    </Layout>
  );
}
