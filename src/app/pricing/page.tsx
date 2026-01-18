import SimplePricing from "@/components/pricing";
import FAQsFour from "@/components/faq";
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - ObitoX",
  description: "Simple, transparent pricing for ObitoX API management. Start free, upgrade as you grow."
};

export default function PricingPage() {
  return (
    <div>
      <HeroHeader />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="bg-primary/10 absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full blur-3xl" />
          <div className="bg-primary/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
          <div className="bg-primary/5 absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
        </div>
        <SimplePricing />
        <FAQsFour />
      </div>
      <FooterSection />
    </div>
  );
}
