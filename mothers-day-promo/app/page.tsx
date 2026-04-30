import HeroSection from "@/components/HeroSection";
import CategoryNav from "@/components/CategoryNav";
import MothersDaySection from "@/components/MothersDaySection";
import FullPromoList from "@/components/FullPromoList";
import StoreSpecificSection from "@/components/StoreSpecificSection";
import TermsSection from "@/components/TermsSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoryNav />

      {/* Sections with alternating bg */}
      <div style={{ background: "#FDF8F2" }}>
        <MothersDaySection />
      </div>

      <div style={{ background: "#F9F3EB" }}>
        <FullPromoList />
      </div>

      <div style={{ background: "#FDF8F2" }}>
        <StoreSpecificSection />
      </div>

      <TermsSection />
      <FooterSection />
    </main>
  );
}
