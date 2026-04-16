import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";
import { AdCard, type AdCardData } from "@/components/cards/ad-card";
import { SearchFilters } from "@/app/search/search-filters";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Find Classes</h1>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <SearchFilters current={{ listingType: "tutor", q, subject, grade, district, classType }} />
        </aside>
        <div className="flex-1">
          {ads.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border px-6 py-16 text-center">
              <p className="text-lg font-semibold text-foreground">No classes match your filters</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[75vh] pr-1">
              <div className="grid gap-4 sm:grid-cols-2">
                {ads.map((ad) => <AdCard key={ad._id} ad={ad} />)}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
