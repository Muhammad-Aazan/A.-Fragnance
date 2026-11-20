import Hero from "@/components/home/Hero";
import Collections from "@/components/home/Collections";
import SignatureTrilogy from "@/components/home/SignatureTrilogy";
import BestSellers from "@/components/home/BestSellers";
import OurStory from "@/components/home/OurStory";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Collections />
      <SignatureTrilogy />
      <BestSellers />
      <OurStory />
      <Testimonials />
      <Newsletter />
    </>
  );
}
