import type { Metadata } from "next";
import Link from "next/link";
import Layout from "@/components/site/Layout";
import SectionHead from "@/components/site/SectionHead";

export const metadata: Metadata = {
  title: "依門市挑選",
  description: "依台北信義店、台中市政店分別查看母親節限定優惠與雙店同步活動。",
  openGraph: {
    title: "依門市挑選 ・ 母親節特輯",
    description: "信義限定 ・ 市政限定 ・ 雙店同步。",
  },
};

export default function StoresPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-[1280px] px-5 md:px-10 pt-16 md:pt-24">
        <SectionHead
          index="04"
          en="By Store"
          zh="依 門 市 查 看"
          description="部分優惠僅限特定門市，請確認後前往選購。"
        />
      </section>

      <section className="mx-auto max-w-[1280px] px-5 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-8">
        <Link href="/xinyi" className="group block">
          <div className="relative aspect-[4/3] overflow-hidden bg-paper-deep">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/store-xinyi.jpg"
              alt="台北信義店"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-paper px-3 py-1">
              <span className="font-display italic text-xs tracking-[0.3em] text-wine">
                Store No. 01
              </span>
            </div>
          </div>
          <div className="mt-5 border-b border-ink pb-3 flex items-baseline justify-between">
            <h3 className="font-serif-tc text-2xl tracking-[0.2em]">台北信義店</h3>
            <span className="font-display italic text-sm text-ink-soft group-hover:text-wine">
              Xinyi →
            </span>
          </div>
          <ul className="mt-5 space-y-2 text-sm text-ink-soft leading-loose">
            <li>・美珂媞歐 全品牌 7 折</li>
            <li>・J-scent 任選 2 件 85 折</li>
            <li>・雙店同步優惠同步適用</li>
          </ul>
        </Link>

        <Link href="/taichung" className="group block">
          <div className="relative aspect-[4/3] overflow-hidden bg-paper-deep">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/store-taichung.jpg"
              alt="台中市政店"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-paper px-3 py-1">
              <span className="font-display italic text-xs tracking-[0.3em] text-wine">
                Store No. 02
              </span>
            </div>
          </div>
          <div className="mt-5 border-b border-ink pb-3 flex items-baseline justify-between">
            <h3 className="font-serif-tc text-2xl tracking-[0.2em]">台中市政店</h3>
            <span className="font-display italic text-sm text-ink-soft group-hover:text-wine">
              Taichung →
            </span>
          </div>
          <ul className="mt-5 space-y-2 text-sm text-ink-soft leading-loose">
            <li>・MAGBLOX 磁力片單盒 9 折</li>
            <li>・沃堤思世界茶莊園 盒裝茶任選 3 件 NT$990</li>
            <li>・雙店同步優惠同步適用</li>
          </ul>
        </Link>
      </section>

      <section className="border-t border-rule bg-paper-deep/30">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10 py-20 md:py-28">
          <SectionHead
            index="05"
            en="Both Stores"
            zh="雙 店 同 步 適 用"
            description="以下品牌優惠在台北信義店與台中市政店皆可享有。"
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-3">
            {([
              ["Yoreh 悠若", "指定傘款 9 折"],
              ["Betterology", "單盒 95 折 ＋ 滿額贈"],
              ["Handiin", "全品牌 88 折"],
              ["LASAI", "母親節套組 NT$1,470"],
              ["覺萃", "全品項 9 折"],
              ["茶寶", "全品項 9 折"],
              ["聖朵波緹", "多項優惠"],
              ["蒔年一晌", "茶咖 88 折／酒品 8 折"],
              ["Panier des Sens", "全系列 75 折"],
              ["今治／Matsukan／MIYAZAKI", "兩件 9 折"],
              ["覓梅酒", "組合 NT$1,280"],
              ["EcoScential", "新品牌上市"],
              ["SONNY ANGEL", "滿三件贈書籤"],
              ["黑白小姐", "滿 NT$200 贈卡片"],
              ["KIND BAG", "清倉 3 折"],
              ["郁郁", "兩件 95 折"],
            ] as [string, string][]).map(([brand, deal]) => (
              <div
                key={brand}
                className="flex items-baseline justify-between border-b border-rule py-3"
              >
                <span className="font-serif-tc text-sm tracking-widest">{brand}</span>
                <span className="text-xs text-wine font-display italic tracking-widest">{deal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
