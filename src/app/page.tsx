import Banner from "@/components/Banner";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import DiseaseMarquee from "@/components/DiseaseMarquee";
import Biomarkers from "@/components/Biomarkers";
import TestimonialsSection from "@/components/TestimonialsSection";
import Testimonials from "@/components/Testimonials";
import ComparisonTable from "@/components/ComparisonTable";
import Pricing from "@/components/Pricing";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import YoloSection from "@/components/YoloSection";
import SectionBreak from "@/components/SectionBreak";
import BlogSection from "@/components/blog/BlogSection";
import { getPublishedPosts, authors, categories } from "@/lib/blog";

export default function Home() {
  const posts = getPublishedPosts();
  const enriched = posts.slice(0, 3).map((p) => ({
    ...p,
    author: authors.find((a) => a.id === p.authorId),
    category: categories.find((c) => c.id === p.categoryId),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      <HeroSection />
      <SectionBreak />
      <HowItWorks />
      <SectionBreak />
      <DiseaseMarquee />
      <SectionBreak />
      <Biomarkers />
      <SectionBreak />
      <TestimonialsSection />
      <SectionBreak />
      <Testimonials />
      <SectionBreak />
      <ComparisonTable />
      <SectionBreak />
      <Pricing />
      <SectionBreak />
      <CtaSection />
      <SectionBreak />
      <BlogSection posts={enriched} />
      <SectionBreak />
      <YoloSection />
      <Footer />
    </div>
  );
}
