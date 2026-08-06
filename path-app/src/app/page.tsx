import { db } from "@/lib/db";
import DynamicStaticPage from "@/app/[slug]/page";
import LuoiHeader from "@/components/LuoiHeader";
import LuoiHeroSection from "@/components/LuoiHeroSection";
import VoucherToolWidget from "@/components/VoucherToolWidget";
import ReelsVideoSection from "@/components/ReelsVideoSection";
import WorkflowSteps from "@/components/WorkflowSteps";
import TrustBadges from "@/components/TrustBadges";
import LuoiFooter from "@/components/LuoiFooter";

export default async function RootHomePage() {
  const [homepageTypeSetting, homepagePageIdSetting] = await Promise.all([
    db.setting.findUnique({ where: { key: "homepage_type" } }),
    db.setting.findUnique({ where: { key: "homepage_page_id" } }),
  ]);

  const homepageType = homepageTypeSetting?.value || "static";
  const homepagePageId = homepagePageIdSetting?.value;

  if (homepageType === "static" && homepagePageId) {
    const selectedPage = await db.page.findUnique({
      where: { id: homepagePageId },
    });

    if (selectedPage && selectedPage.isPublished) {
      return (
        <DynamicStaticPage
          params={Promise.resolve({ slug: selectedPage.slug })}
        />
      );
    }
  }

  // Fallback to default /home page if no static page configured
  const homePage = await db.page.findUnique({
    where: { slug: "home" },
  });

  if (homePage && homePage.isPublished) {
    return <DynamicStaticPage params={Promise.resolve({ slug: "home" })} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-[#1c1917] font-sans antialiased selection:bg-[#ccfbf1] selection:text-[#0d9488]">
      <LuoiHeader />
      <main className="flex-1">
        {/* VÙNG TÔ ĐỎ 1: Hero Banner + Công Cụ Chuyển Đổi Link Affiliate (qini-home.afp.ad) */}
        <LuoiHeroSection />
        
        <div id="tool-widget" className="scroll-mt-14">
          <VoucherToolWidget />
        </div>

        {/* VÙNG TÔ ĐỎ 2: Khung Video Dạng Reels / Shorts (Nhúng Shortcode) */}
        <ReelsVideoSection />

        <WorkflowSteps />
        <TrustBadges />
      </main>
      <LuoiFooter />
    </div>
  );
}
