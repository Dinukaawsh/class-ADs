import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";
import Image from "next/image";
import Link from "next/link";
import { type AdCardData } from "@/components/ad-card";
import { SearchFiltersHorizontal } from "@/components/search/search-filters";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Find Classes",
  description: "Search tuition classes by subject, grade, district and more.",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

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
    bannerType: ((doc.bannerType as "premium" | "normal" | undefined) ?? "normal"),
    body: (doc.body as string) ?? "",
    createdAt: (doc.createdAt as Date)?.toISOString?.() ?? new Date().toISOString(),
    className: (doc.className as string) ?? "",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const subject = typeof sp.subject === "string" ? sp.subject : "";
  const grade = typeof sp.grade === "string" ? sp.grade : "";
  const district = typeof sp.district === "string" ? sp.district : "";
  const classType = typeof sp.classType === "string" ? sp.classType : "";
  const featured = sp.featured === "true";
  await connectToDatabase();
  const filter: Record<string, unknown> = { status: "approved" };
  if (subject) filter.subject = subject;
  if (grade) filter.grade = grade;
  if (district) filter.district = district;
  if (classType) filter.classType = classType;
  if (featured) filter.isFeatured = true;
  if (q) {
    filter.$or = [{ title: { $regex: q, $options: "i" } }, { body: { $regex: q, $options: "i" } }, { subject: { $regex: q, $options: "i" } }, { tutorName: { $regex: q, $options: "i" } }];
  }
  const ads: AdCardData[] = (await Ad.find(filter).sort({ isFeatured: -1, createdAt: -1 }).limit(50).lean()).map(toCardData);
  const premiumBannerAds = ads.filter((ad) => ad.bannerType === "premium").slice(0, 6);
  const normalBannerAds = ads.filter((ad) => ad.bannerType !== "premium").slice(0, 12);
  const bannerRows = Array.from({ length: 6 }, (_, index) => index);

  return (
    <div className="w-full px-2 py-6 sm:px-4 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Latest Classes</h1>
        <Link href="/search" className="text-sm font-semibold text-primary hover:underline">
          Browse all →
        </Link>
      </div>
      <SearchFiltersHorizontal current={{ listingType: "tutor", q, subject, grade, district, classType }} showOnScroll />
      <div className="mt-4 space-y-4">
        {bannerRows.map((row) => {
          const leftNormal = normalBannerAds[row * 2];
          const centerPremium = premiumBannerAds[row];
          const rightNormal = normalBannerAds[row * 2 + 1];

          return (
            <div key={`search-banner-row-${row}`} className="grid gap-4 lg:grid-cols-[1fr_2.5fr_1fr]">
              <Link
                href={leftNormal ? `/ads/${leftNormal._id}` : "/advertise"}
                className="group overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="relative h-64 bg-muted">
                  {leftNormal?.imageUrl ? (
                    <Image src={leftNormal.imageUrl} alt={leftNormal.title} fill className="object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-muted-foreground">Normal banner slot</div>
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
                    <div className="flex h-full items-center justify-center text-sm font-medium text-muted-foreground">Premium horizontal banner</div>
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
                    <div className="flex h-full items-center justify-center text-sm font-medium text-muted-foreground">Normal banner slot</div>
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
  );
}
