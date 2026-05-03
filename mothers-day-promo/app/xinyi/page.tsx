import type { Metadata } from "next";
import Link from "next/link";
import Layout from "@/components/site/Layout";
import SectionHead from "@/components/site/SectionHead";
import PromoCard from "@/components/site/PromoCard";
import { promotions } from "@/lib/promotions";

export const metadata: Metadata = {
  title: "台北信義店優惠",
  description: "TSUTAYA BOOKSTORE 台北信義店母親節限定品牌優惠：美珂媞歐 7 折、J-scent 等。",
  openGraph: {
    title: "台北信義店優惠 ・ 母親節特輯",
    description: "信義限定優惠＋雙店同步活動一次掌握。",
  },
};

export default function XinyiPage() {
  const xinyiOnly = promotions.filter((p) => p.store === "xinyi");
  const both = promotions.filter((p) => p.store === "both");

  return (
    <Layout>
      <section className="relative">
        <div className="relative aspect-[16/9] md:aspect-[16/7] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/store-xinyi.jpg"
            alt="台北信義店"
            className="w-full h-full object-cover"
            width={1600}
            height={1100}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="mx-auto max-w-[1280px] px-5 md:px-10 pb-8 md:pb-14 text-paper">
              <p className="font-display italic text-sm tracking-[0.35em]">Store No. 01</p>
              <h1 className="mt-3 font-serif-tc text-4xl md:text-7xl font-light tracking-[0.2em]">
                台 北 信 義 店
              </h1>
              <p className="mt-4 max-w-xl text-sm md:text-base leading-loose opacity-90">
                TSUTAYA BOOKSTORE 台北信義店 ・ 信義限定品牌與雙店同步優惠匯整。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 md:px-10 py-20 md:py-28">
        <SectionHead
          index="01"
          en="Xinyi Exclusive"
          zh="信 義 限 定"
          description="僅限 TSUTAYA BOOKSTORE 台北信義店之品牌優惠。"
        />
        <div className="mt-10">
          {xinyiOnly.map((p, i) => (
            <PromoCard key={p.id} promo={p} index={i + 1} />
          ))}
        </div>
      </section>

      <section className="border-t border-rule bg-paper-deep/30">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10 py-20 md:py-28">
          <SectionHead
            index="02"
            en="Also Available"
            zh="雙 店 同 步 ・ 信 義 亦 適 用"
            description="以下品牌優惠在台北信義店亦可享有。"
          />
          <div className="mt-10">
            {both.map((p, i) => (
              <PromoCard key={p.id} promo={p} index={i + 1} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/taichung"
              className="inline-flex items-center gap-3 font-serif-tc tracking-[0.25em] text-ink hover:text-wine"
            >
              <span className="h-px w-10 bg-current" />
              查看台中市政店
              <span className="font-display italic">→</span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
