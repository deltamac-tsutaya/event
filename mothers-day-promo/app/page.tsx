import HeroSection from "@/components/HeroSection";
import CategoryNav from "@/components/CategoryNav";
import MothersDaySection from "@/components/MothersDaySection";
import FullPromoList from "@/components/FullPromoList";
import StoreSpecificSection from "@/components/StoreSpecificSection";
import TermsSection from "@/components/TermsSection";
import FooterSection from "@/components/FooterSection";
import AutoRefresh from "@/components/AutoRefresh";

// Revalidate page every 5 minutes on the server
export const revalidate = 300;

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoryNav />

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

      {/* Auto-refresh overlay indicator */}
      <AutoRefresh />
    </main>
  );
}
