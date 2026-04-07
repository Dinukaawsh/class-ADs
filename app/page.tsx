import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";
import { AdCard, type AdCardData } from "@/components/ad-card";
import { HeroSearch } from "@/components/hero-search";
import { CategoryCards } from "@/components/category-cards";
import { StatsBar } from "@/components/stats-bar";

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

  const featured = await Ad.find({ status: "approved", isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  const recent = await Ad.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

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
            <h2 className="text-2xl font-bold text-foreground">
              Featured Classes
            </h2>
            <Link
              href="/search?featured=true"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredAds.map((ad) => (
              <AdCard key={ad._id} ad={ad} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Latest Classes
          </h2>
          <Link
            href="/search"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Browse all →
          </Link>
        </div>
        {recentAds.length === 0 ? (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-border px-6 py-16 text-center">
            <p className="text-lg font-semibold text-foreground">
              No classes listed yet
            </p>
            <p className="mt-2 text-sm text-muted">
              Be the first to post a tuition class and reach students across Sri Lanka.
            </p>
            <Link
              href="/submit"
              className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Post Your Class
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentAds.map((ad) => (
              <AdCard key={ad._id} ad={ad} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Are You a Tutor?
          </h2>
          <p className="mt-3 text-muted">
            Reach thousands of students looking for tuition classes. Post your
            advertisement for free and start getting inquiries today.
          </p>
          <Link
            href="/submit"
            className="mt-6 inline-block rounded-lg bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-primary-dark hover:shadow-xl"
          >
            Post Your Class — It&apos;s Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-white px-4 py-10 dark:bg-surface">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-xs">
                CA
              </div>
              <span className="font-bold text-foreground">ClassAds</span>
            </div>
            <p className="mt-3 text-sm text-muted">
              Sri Lanka&apos;s modern tuition class marketplace. Find the best
              classes or promote your teaching.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/search" className="hover:text-primary transition">Find Classes</Link></li>
              <li><Link href="/submit" className="hover:text-primary transition">Post an Ad</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition">Admin Panel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Popular Subjects</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/search?subject=Mathematics" className="hover:text-primary transition">Mathematics</Link></li>
              <li><Link href="/search?subject=Physics" className="hover:text-primary transition">Physics</Link></li>
              <li><Link href="/search?subject=Chemistry" className="hover:text-primary transition">Chemistry</Link></li>
              <li><Link href="/search?subject=English" className="hover:text-primary transition">English</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} ClassAds. All rights reserved.
        </div>
      </footer>
    </>
  );
}
