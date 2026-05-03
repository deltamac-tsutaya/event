import type { Promotion } from "@/lib/promotions";
import { stores } from "@/lib/promotions";

const storeBadge: Record<Promotion["store"], string> = {
  both: "雙店適用",
  xinyi: "信義限定",
  taichung: "市政限定",
};

export default function PromoCard({ promo, index }: { promo: Promotion; index: number }) {
  return (
    <article className="group relative grid grid-cols-12 gap-4 py-8 border-b border-rule">
      <div className="col-span-2 md:col-span-1">
        <span className="num-index block">{String(index).padStart(2, "0")}</span>
      </div>
      <div className="col-span-10 md:col-span-3">
        <p className="eyebrow text-wine/80">{promo.brand}</p>
        {promo.tagline && (
          <p className="mt-2 font-serif-tc text-sm tracking-widest text-ink-soft">
            {promo.tagline}
          </p>
        )}
        {promo.audience && (
          <p className="mt-3 font-serif-tc text-xs text-ink-soft/80 leading-loose">
            {promo.audience}
          </p>
        )}
      </div>
      <div className="col-span-12 md:col-span-5">
        <h3 className="font-serif-tc text-xl md:text-2xl font-light tracking-[0.1em] text-ink leading-snug">
          {promo.title}
          {promo.price && (
            <span className="ml-3 font-display italic text-wine">{promo.price}</span>
          )}
        </h3>
        <p className="mt-3 text-sm leading-[2] text-ink-soft">{promo.description}</p>
        {promo.notes && (
          <p className="mt-3 text-xs text-wine/80 tracking-wider">＊ {promo.notes}</p>
        )}
      </div>
      <div className="col-span-12 md:col-span-3 md:text-right space-y-2">
        <p className="font-display italic text-sm text-ink-soft">{promo.period}</p>
        <p className="text-xs tracking-[0.2em] text-ink">
          <span className="inline-block px-2 py-1 border border-rule">
            {storeBadge[promo.store]}
          </span>
        </p>
        <p className="text-[11px] text-ink-soft/70 tracking-wider">{stores[promo.store]}</p>
      </div>
    </article>
  );
}
