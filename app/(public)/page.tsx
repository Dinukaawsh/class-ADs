import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";
import { AdCard, type AdCardData } from "@/components/ad-card";
import { HeroSearch } from "@/components/hero-search";
import { CategoryCards } from "@/components/category-cards";
import { StatsBar } from "@/components/stats-bar";
import { AdCarousel } from "@/components/ads/ad-carousel";

export const dynamic = "force-dynamic";

function toCardData(doc: Record<string, unknown>): AdCardData {
  return {
    _id: String(doc._id),
    title: (doc.title as string) ?? "",
    subject: (doc.subject as string) ?? (doc.className as string) ?? "",
    grade: (doc.grade as string) ?? "",
    district: (doc.district as string) ?? "",
    city: (doc.city as string) ?? "",
    classType: (doc.classType as string) ?? "Online",
    imageUrl: (doc.imageUrl as string) ?? "",
    price: (doc.price as string) ?? "",
    tutorName: (doc.tutorName as string) ?? "Unknown",
    tutorQualification: (doc.tutorQualification as string) ?? "",
    phone: (doc.phone as string) ?? "",
    whatsapp: (doc.whatsapp as string) ?? "",
    isFeatured: (doc.isFeatured as boolean) ?? false,
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

  return (
    <>
      <HeroSearch />
      <StatsBar />
      <CategoryCards />
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
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Latest Classes</h2>
          <Link href="/search" className="text-sm font-semibold text-primary hover:underline">Browse all →</Link>
        </div>
        {recentAds.length === 0 ? (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-border px-6 py-16 text-center">
            <p className="text-lg font-semibold text-foreground">No classes listed yet</p>
            <p className="mt-2 text-sm text-muted">Be the first to post a tuition class and reach students across Sri Lanka.</p>
            <Link href="/submit" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark">Post Your Class</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentAds.map((ad) => <AdCard key={ad._id} ad={ad} />)}
          </div>
        )}
      </section>
    </>
  );
}
