import HeroSection from "@/components/HeroSection";
import CategoryNav from "@/components/CategoryNav";
import MothersDaySection from "@/components/MothersDaySection";
import UrgentOffersSection from "@/components/UrgentOffersSection";
import StoreQuickNav from "@/components/StoreQuickNav";
import BudgetSection from "@/components/BudgetSection";
import FullPromoList from "@/components/FullPromoList";
import StoreSpecificSection from "@/components/StoreSpecificSection";
import TermsSection from "@/components/TermsSection";
import FooterSection from "@/components/FooterSection";

export const revalidate = 300;

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoryNav />

      {/* 母親節送禮推薦 */}
      <div style={{ background: "#FDF8F2" }}>
        <MothersDaySection />
      </div>

      {/* 5/10 前限時優惠 */}
      <div style={{ background: "#F5EDE0" }}>
        <UrgentOffersSection />
      </div>

      {/* 依門市查看優惠 */}
      <div style={{ background: "#FDF8F2" }}>
        <StoreQuickNav />
      </div>

      {/* 依預算挑選 */}
      <div style={{ background: "#F9F3EB" }}>
        <BudgetSection />
      </div>

      {/* 香氛保養 / 生活配件 / 茶咖酒禮盒 / 親子選品 */}
      <div style={{ background: "#FDF8F2" }}>
        <FullPromoList />
      </div>

      {/* 門市限定與雙店適用總表 */}
      <div style={{ background: "#F5EDE0" }}>
        <StoreSpecificSection />
      </div>

      <TermsSection />
      <FooterSection />
    </main>
  );
}
