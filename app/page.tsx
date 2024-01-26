import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/shared/Footer";

export default function LandingPage() {
    return (
        <div className="h-full w-full flex flex-col items-center">
            <Hero />
            <Features />
            <Pricing />
            <Footer />
        </div>
    );
}
