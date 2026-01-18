import Image from "next/image";
import HeroSection from "@/components/hero-section";
import FooterSection from "@/components/footer";
import IntegrateSection from "@/components/integrate-section";
import FeatureBanner from "@/components/feature-banner";
import FeatureGrid from "@/components/feature-grid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ObitoX - Modern API Management Platform",
  description: "Enterprise-grade API management, rate limiting, and analytics. Protect your APIs with advanced security and monitoring."
};

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Global Background */}
      <div className="fixed inset-0 -z-30 h-screen w-full">
        <Image
          src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
          alt="background"
          fill
          className="object-cover opacity-60 hidden dark:block"
          priority
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_0%,var(--color-background)_100%)]"
        />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <FeatureBanner />
        <FeatureGrid />
        <IntegrateSection />
        <FooterSection />
      </div>
    </main>
  );
}
