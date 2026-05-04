import Link from "next/link";
import Image from "next/image";
import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";
import { type AdCardData } from "@/components/ad-card";
import { HeroSearch } from "@/components/hero-search";
import { StatsBar } from "@/components/stats-bar";
import { AdCarousel } from "@/components/ads/ad-carousel";
import { EmptyBannerPlaceholder } from "@/components/ads/empty-banner-placeholder";

export const dynamic = "force-dynamic";

function toCardData(doc: Record<string, unknown>): AdCardData {
  return {
    _id: String(doc._id),
    title: (doc.title as string) ?? "",
    subject: (doc.subject as string) ?? (doc.className as string) ?? "",
    grade: (doc.grade as string) ?? "",
    district: (doc.district as string) ?? "",
    city: (doc.city as string) ?? "",
    mapLocationUrl: (doc.mapLocationUrl as string) ?? "",
    classType: (doc.classType as string) ?? "Online",
    imageUrl: (doc.imageUrl as string) ?? "",
    price: (doc.price as string) ?? "",
    tutorName: (doc.tutorName as string) ?? "Unknown",
    tutorQualification: (doc.tutorQualification as string) ?? "",
    phone: (doc.phone as string) ?? "",
    whatsapp: (doc.whatsapp as string) ?? "",
    isFeatured: (doc.isFeatured as boolean) ?? false,
    bannerType: ((doc.bannerType as "premium" | "normal" | undefined) ?? "normal"),
    body: (doc.body as string) ?? "",
    createdAt: (doc.createdAt as Date)?.toISOString?.() ?? new Date().toISOString(),
    className: (doc.className as string) ?? "",
  };
}

export default async function Home() {
  await connectToDatabase();
  const featured = await Ad.find({ status: "approved", isFeatured: true }).sort({ createdAt: -1 }).limit(6).lean();
  const recent = await Ad.find({ status: "approved" }).sort({ createdAt: -1 }).limit(12).lean();
  const featuredAds: AdCardData[] = featured.map(toCardData);
  const recentAds: AdCardData[] = recent.map(toCardData);
  const approvedAdsForBanners = recentAds;
  const premiumBannerAds = approvedAdsForBanners.filter((ad) => ad.bannerType === "premium").slice(0, 6);
  const normalBannerAds = approvedAdsForBanners.filter((ad) => ad.bannerType !== "premium").slice(0, 12);
  const bannerRows = Array.from({ length: 6 }, (_, index) => index);

  return (
    <>
      <HeroSearch />
      <StatsBar />
      {featuredAds.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Featured Classes</h2>
            <Link href="/search?featured=true" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
          </div>
          <div className="mt-6">
            <AdCarousel ads={featuredAds} />
          </div>
        </section>
      )}
      <section className="w-full px-2 pb-16 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Latest Classes</h2>
          <Link href="/search" className="text-sm font-semibold text-primary hover:underline">Browse all →</Link>
        </div>
        <div className="mt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Premium Banners</p>
          <div className="space-y-4">
            {bannerRows.map((row) => {
              const leftNormal = normalBannerAds[row * 2];
              const centerPremium = premiumBannerAds[row];
              const rightNormal = normalBannerAds[row * 2 + 1];

              return (
                <div key={`banner-row-${row}`} className="grid gap-4 lg:grid-cols-[1fr_2.5fr_1fr]">
                  <Link
                    href={leftNormal ? `/ads/${leftNormal._id}` : "/advertise"}
                    className="group overflow-hidden rounded-lg border border-border bg-card"
                  >
                    <div className="relative h-64 bg-muted">
                      {leftNormal?.imageUrl ? (
                        <Image src={leftNormal.imageUrl} alt={leftNormal.title} fill className="object-cover transition duration-300 group-hover:scale-105" />
                      ) : (
                        <EmptyBannerPlaceholder variant="normal" />
                      )}
                    </div>
                    <div className="space-y-2 p-4">
                      <span className="inline-flex rounded-full bg-[#60a5fa] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Sponsored</span>
                      <h3 className="line-clamp-2 text-base font-semibold text-foreground">{leftNormal?.title ?? "Normal banner slot"}</h3>
                      <p className="line-clamp-2 text-sm text-muted">{leftNormal ? `${leftNormal.subject} • ${leftNormal.grade}` : "Contact admin to reserve this square placement."}</p>
                    </div>
                  </Link>

                  <Link
                    href={centerPremium ? `/ads/${centerPremium._id}` : "/advertise"}
                    className="group overflow-hidden rounded-lg border border-border bg-card"
                  >
                    <div className="relative h-48 bg-muted lg:h-56">
                      {centerPremium?.imageUrl ? (
                        <Image src={centerPremium.imageUrl} alt={centerPremium.title} fill className="object-cover transition duration-300 group-hover:scale-105" />
                      ) : (
                        <EmptyBannerPlaceholder variant="premium" />
                      )}
                    </div>
                    <div className="space-y-2 p-5">
                      <span className="inline-flex rounded-full bg-[#60a5fa] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Sponsored • Hero Placement</span>
                      <p className="text-xs text-muted">Recommended size 1200 x 600 px</p>
                      <h3 className="line-clamp-2 text-3xl font-bold leading-tight text-foreground">{centerPremium?.title ?? "Premium horizontal banner"}</h3>
                      <p className="line-clamp-2 text-sm text-muted">{centerPremium ? `${centerPremium.subject} • ${centerPremium.grade}` : "High-visibility slot for institutes and major campaigns."}</p>
                    </div>
                  </Link>

                  <Link
                    href={rightNormal ? `/ads/${rightNormal._id}` : "/advertise"}
                    className="group overflow-hidden rounded-lg border border-border bg-card"
                  >
                    <div className="relative h-64 bg-muted">
                      {rightNormal?.imageUrl ? (
                        <Image src={rightNormal.imageUrl} alt={rightNormal.title} fill className="object-cover transition duration-300 group-hover:scale-105" />
                      ) : (
                        <EmptyBannerPlaceholder variant="normal" />
                      )}
                    </div>
                    <div className="space-y-2 p-4">
                      <span className="inline-flex rounded-full bg-[#60a5fa] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Sponsored</span>
                      <h3 className="line-clamp-2 text-base font-semibold text-foreground">{rightNormal?.title ?? "Normal banner slot"}</h3>
                      <p className="line-clamp-2 text-sm text-muted">{rightNormal ? `${rightNormal.subject} • ${rightNormal.grade}` : "Contact admin to reserve this square placement."}</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
