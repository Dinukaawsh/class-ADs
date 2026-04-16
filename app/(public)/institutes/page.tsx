import Link from "next/link";
import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/db";
import { Institute } from "@/models/Institute";
import { InstituteCard, type InstituteCardData } from "@/components/institute-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Institutes",
  description: "Discover verified tuition institutes, academies, and training centers.",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toInstituteCard(doc: Record<string, unknown>): InstituteCardData {
  return {
    _id: String(doc._id),
    slug: (doc.slug as string) ?? "",
    name: (doc.name as string) ?? "Institute",
    logoUrl: (doc.logoUrl as string) ?? "",
    district: (doc.district as string) ?? "",
    city: (doc.city as string) ?? "",
    subjects: ((doc.subjects as string[]) ?? []).filter(Boolean),
    description: (doc.description as string) ?? "",
    phone: (doc.phone as string) ?? "",
    whatsapp: (doc.whatsapp as string) ?? "",
    website: (doc.website as string) ?? "",
    rating: (doc.rating as number) ?? 4.5,
    reviewCount: (doc.reviewCount as number) ?? 0,
    totalCourses: (doc.totalCourses as number) ?? 0,
    isFeatured: (doc.isFeatured as boolean) ?? false,
    isVerified: (doc.isVerified as boolean) ?? false,
  };
}

export default async function InstitutesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const subject = typeof sp.subject === "string" ? sp.subject : "";
  const district = typeof sp.district === "string" ? sp.district : "";
  const featured = sp.featured === "true";
  await connectToDatabase();
  const filter: Record<string, unknown> = { status: "approved", isVerified: true };
  if (subject) filter.subjects = subject;
  if (district) filter.district = district;
  if (featured) filter.isFeatured = true;
  if (q) {
    filter.$or = [{ name: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }, { subjects: { $regex: q, $options: "i" } }];
  }
  const docs = await Institute.find(filter).sort({ isFeatured: -1, createdAt: -1 }).limit(60).lean();
  const institutes: InstituteCardData[] = docs.map(toInstituteCard);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Institutes</h1>
          <p className="mt-1 text-sm text-muted">{institutes.length} verified institute{institutes.length !== 1 ? "s" : ""} found</p>
        </div>
        <div className="flex gap-2">
          <Link href="/institutes/dashboard" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-alt">Institute Dashboard</Link>
          <Link href="/institutes/new" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark">List Your Institute</Link>
        </div>
      </div>
      {institutes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border px-6 py-16 text-center">
          <p className="text-lg font-semibold text-foreground">No institutes found</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {institutes.map((institute) => <InstituteCard key={institute._id} institute={institute} />)}
        </div>
      )}
    </div>
  );
}
