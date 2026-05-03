import Link from "next/link";
import type { Metadata } from "next";
import Layout from "@/components/site/Layout";
import SectionHead from "@/components/site/SectionHead";
import PromoCard from "@/components/site/PromoCard";
import { promotions, audienceGroups } from "@/lib/promotions";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "母親節特輯 ・ TSUTAYA BOOKSTORE 2026" },
  description:
    "TSUTAYA BOOKSTORE 母親節特輯 — 精選溫馨母親節禮物，搭配淡雅香氛、細膩保養、茶韻酒香禮盒及點綴生活的日常小物。",
  openGraph: {
    title: "母親節特輯 ・ TSUTAYA BOOKSTORE 2026",
    description: "為心意注入詩意與美感。活動期間 5/1 — 5/31，台北信義店・台中市政店。",
    locale: "zh_TW",
    type: "website",
  },
};

const brandMarquee = [
  "LASAI", "Panier des Sens", "聖朵波緹", "蒔年一晌",
  "J-scent", "EcoScential", "茶寶", "Handiin",
  "今治 TOWEL", "MAGBLOX", "SONNY ANGEL", "Yoreh 悠若",
];

const categories = [
  { href: "/gifts", en: "Fragrance & Care", zh: "香氛・保養", num: "01" },
  { href: "/gifts", en: "Tea・Coffee・Wine", zh: "茶・咖啡・酒", num: "02" },
  { href: "/gifts", en: "Lifestyle", zh: "生活配件", num: "03" },
  { href: "/gifts", en: "Family", zh: "親子選品", num: "04" },
];

export default function Home() {
  const featured = promotions.slice(0, 4);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10 pt-10 md:pt-16">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
            <div className="md:col-span-6 md:order-1 order-2">
              <div className="flex items-center gap-4">
                <span className="num-index">— Vol. 05 ／ 2026</span>
                <span className="h-px w-12 bg-rule" />
                <span className="eyebrow">Tsutaya Bookstore</span>
              </div>
              <h1 className="mt-6 font-serif-tc text-[44px] md:text-[78px] leading-[1.15] tracking-[0.06em] text-ink font-light">
                為母親<br />
                <span className="font-display italic text-wine text-[40px] md:text-[64px]">
                  préparer un cadeau
                </span>
                <br />
                <span className="text-ink">挑一份心意</span>
              </h1>

              <div className="mt-8 max-w-md">
                <p className="text-[15px] leading-[2.1] text-ink-soft">
                  精選溫馨母親節禮物，搭配淡雅香氛、細膩保養、茶韻酒香禮盒及點綴生活的日常小物—
                  為心意注入詩意與美感。
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <p className="eyebrow">Period</p>
                  <p className="mt-1 font-serif-tc tracking-widest">5 ／ 1 — 5 ／ 31</p>
                </div>
                <span className="vrule h-10" />
                <div>
                  <p className="eyebrow">Stores</p>
                  <p className="mt-1 font-serif-tc tracking-widest">信義 ・ 市政</p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/gifts"
                  className="group inline-flex items-center gap-3 px-6 py-3 bg-ink text-paper text-sm tracking-[0.2em] hover:bg-wine transition-colors"
                >
                  <span className="font-serif-tc">送禮推薦</span>
                  <span className="font-display italic">→</span>
                </Link>
                <Link
                  href="/xinyi"
                  className="inline-flex items-center gap-3 px-6 py-3 border border-ink/80 text-ink text-sm tracking-[0.2em] hover:bg-ink hover:text-paper transition-colors"
                >
                  <span className="font-serif-tc">信義店</span>
                </Link>
                <Link
                  href="/taichung"
                  className="inline-flex items-center gap-3 px-6 py-3 border border-ink/80 text-ink text-sm tracking-[0.2em] hover:bg-ink hover:text-paper transition-colors"
                >
                  <span className="font-serif-tc">市政店</span>
                </Link>
              </div>
            </div>

            <div className="md:col-span-6 md:order-2 order-1 relative">
              <div className="relative aspect-[3/4] overflow-hidden bg-paper-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-still-life.jpg"
                  alt="母親節靜物：花束、香氛、茶禮"
                  className="w-full h-full object-cover"
                  width={1080}
                  height={1440}
                />
              </div>
              <div className="absolute -bottom-4 -left-4 md:-left-8 bg-paper px-4 py-3 border border-rule">
                <p className="font-display italic text-xs tracking-[0.3em] text-wine">
                  Editorial No. 05
                </p>
                <p className="font-serif-tc text-sm tracking-widest mt-1">致 ・ 親 愛 的 她</p>
              </div>
            </div>
          </div>
        </div>

        {/* marquee strip */}
        <div className="mt-20 border-y border-rule overflow-hidden bg-paper-deep/40">
          <div className="flex gap-12 py-4 whitespace-nowrap animate-[scroll_40s_linear_infinite]">
            {[0, 1].map((k) => (
              <div key={k} className="flex gap-12 shrink-0">
                {brandMarquee.map((b) => (
                  <span
                    key={b + k}
                    className="font-display italic tracking-[0.3em] text-ink-soft text-sm"
                  >
                    ✦ {b}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[1280px] px-5 md:px-10 py-24 md:py-32">
        <SectionHead
          index="01"
          en="Editor's Picks"
          zh="本期主題分類"
          description="從香氛、保養、茶咖酒禮盒到生活配件與親子選品，依主題挑選最合適的心意。"
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((c) => (
            <Link key={c.zh} href={c.href} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
                <div className="absolute top-3 left-3 bg-paper/90 backdrop-blur px-3 py-1">
                  <span className="font-display italic text-xs text-wine tracking-[0.25em]">
                    No. {c.num}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between border-b border-rule pb-3">
                <h3 className="font-serif-tc text-lg tracking-[0.2em]">{c.zh}</h3>
                <span className="font-display italic text-xs tracking-[0.2em] text-ink-soft group-hover:text-wine transition-colors">
                  {c.en} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="border-y border-rule bg-paper-deep/30">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10 py-24 md:py-32">
          <SectionHead
            index="02"
            en="Featured Selections"
            zh="本期精選"
            description="幾款編輯特別推薦的心意選品，無論是想犒賞自己，或是慎重送禮，皆有合適的選擇。"
          />

          <div className="mt-14 grid md:grid-cols-2 gap-x-12 gap-y-2">
            {featured.map((p, i) => (
              <PromoCard key={p.id} promo={p} index={i + 1} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/gifts"
              className="inline-flex items-center gap-3 font-serif-tc tracking-[0.25em] text-ink hover:text-wine transition-colors"
            >
              <span className="h-px w-10 bg-current" />
              查看全部送禮推薦
              <span className="font-display italic">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="mx-auto max-w-[1280px] px-5 md:px-10 py-24 md:py-32">
        <SectionHead
          index="03"
          en="By Recipient"
          zh="依對象挑選"
          description="依照收禮對象的喜好，快速找到最適合的選品。"
        />

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audienceGroups.map((g, i) => (
            <div
              key={g.title}
              className="border border-rule p-6 md:p-8 bg-paper hover:bg-paper-deep/40 transition-colors"
            >
              <p className="num-index">{String(i + 1).padStart(2, "00")}</p>
              <p className="mt-4 eyebrow">{g.en}</p>
              <h3 className="mt-3 font-serif-tc text-lg tracking-[0.18em] leading-loose">
                {g.title}
              </h3>
              <ul className="mt-6 space-y-2">
                {g.brands.map((b) => (
                  <li
                    key={b}
                    className="text-sm text-ink-soft border-b border-rule/50 pb-2 flex items-center gap-2"
                  >
                    <span className="text-wine font-display italic">·</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* STORES split */}
      <section className="border-t border-rule">
        <div className="grid md:grid-cols-2">
          <Link
            href="/xinyi"
            className="group relative block aspect-[4/3] md:aspect-auto md:min-h-[460px] overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/store-xinyi.jpg"
              alt="台北信義店"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/45 transition-colors" />
            <div className="relative h-full flex flex-col justify-end p-8 md:p-14 text-paper">
              <p className="font-display italic text-sm tracking-[0.3em]">Store No. 01</p>
              <h3 className="mt-3 font-serif-tc text-3xl md:text-5xl tracking-[0.2em] font-light">
                台 北 信 義 店
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-loose opacity-90">
                美珂媞歐 全品牌 7 折 ・ J-scent 任選 2 件 85 折
              </p>
              <span className="mt-6 font-display italic tracking-[0.25em] text-sm">Discover →</span>
            </div>
          </Link>

          <Link
            href="/taichung"
            className="group relative block aspect-[4/3] md:aspect-auto md:min-h-[460px] overflow-hidden border-t md:border-t-0 md:border-l border-rule"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/store-taichung.jpg"
              alt="台中市政店"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/45 transition-colors" />
            <div className="relative h-full flex flex-col justify-end p-8 md:p-14 text-paper">
              <p className="font-display italic text-sm tracking-[0.3em]">Store No. 02</p>
              <h3 className="mt-3 font-serif-tc text-3xl md:text-5xl tracking-[0.2em] font-light">
                台 中 市 政 店
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-loose opacity-90">
                MAGBLOX 磁力片單盒 9 折 ・ 沃堤思世界茶莊園 盒裝茶任選 3 件 NT$990
              </p>
              <span className="mt-6 font-display italic tracking-[0.25em] text-sm">Discover →</span>
            </div>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
