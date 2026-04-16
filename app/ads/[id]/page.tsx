import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";
import { type AdCardData } from "@/components/ad-card";
import { ContactButtons } from "./contact-buttons";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

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
    createdAt:
      (doc.createdAt as Date)?.toISOString?.() ?? new Date().toISOString(),
    className: (doc.className as string) ?? "",
  };
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return { title: "Not found" };
  await connectToDatabase();
  const doc = await Ad.findById(id).lean();
  if (!doc || doc.status !== "approved") return { title: "Not found" };
  return {
    title: doc.title,
    description: (doc.body as string)?.slice(0, 160),
  };
}

export default async function AdDetailPage({ params }: Props) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();

  await connectToDatabase();
  const doc = await Ad.findById(id).lean();
  if (!doc || doc.status !== "approved") notFound();

  await Ad.findByIdAndUpdate(id, { $inc: { views: 1 } }).catch(() => {});

  const similar = await Ad.find({
    status: "approved",
    _id: { $ne: doc._id },
    $or: [
      { subject: doc.subject },
      { grade: doc.grade },
    ],
  })
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(4)
    .lean();

  const similarAds: AdCardData[] = similar.map(toCardData);

  const location = [doc.city, doc.district].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/search"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted transition hover:text-primary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Search
      </Link>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            {doc.imageUrl && (
              <div className="-mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl border-b border-border sm:-mx-8 sm:-mt-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={String(doc.imageUrl)}
                  alt={String(doc.title)}
                  className="h-64 w-full object-cover sm:h-80"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {doc.subject || doc.className}
              </span>
              <span className="inline-flex items-center rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-muted">
                {doc.grade}
              </span>
              <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                {doc.classType || "Online"}
              </span>
              {doc.isFeatured && (
                <span className="inline-flex items-center rounded-full bg-warning px-3 py-1 text-xs font-bold text-white">
                  Featured
                </span>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
              {doc.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
                <span className="font-medium text-foreground">{doc.tutorName}</span>
              </span>
              {doc.tutorQualification && (
                <span className="text-muted">
                  {doc.tutorQualification}
                </span>
              )}
            </div>

            {(location || doc.price) && (
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
                {location && (
                  <span className="flex items-center gap-1.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                    {location}
                  </span>
                )}
                {doc.price && (
                  <span className="font-semibold text-success">
                    Rs. {doc.price}
                  </span>
                )}
              </div>
            )}

            <p className="mt-2 text-xs text-muted">
              Posted{" "}
              {new Date(doc.createdAt).toLocaleDateString(undefined, {
                dateStyle: "long",
              })}
              {doc.views > 0 && ` · ${doc.views} views`}
            </p>

            <hr className="my-6 border-border" />

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
                Description
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
                {doc.body}
              </p>
            </div>

            <hr className="my-6 border-border" />

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Subject" value={doc.subject || doc.className} />
              <DetailItem label="Grade Level" value={doc.grade} />
              <DetailItem label="Class Type" value={doc.classType || "Online"} />
              <DetailItem label="District" value={doc.district} />
              {doc.city && <DetailItem label="City" value={doc.city} />}
              {doc.price && <DetailItem label="Fee" value={`Rs. ${doc.price}`} />}
            </div>
          </div>
        </div>

        <aside className="w-full shrink-0 lg:w-80">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {(doc.tutorName as string)?.[0]?.toUpperCase() ?? "T"}
                </div>
                <h3 className="mt-3 text-lg font-bold text-foreground">
                  {doc.tutorName}
                </h3>
                {doc.tutorQualification && (
                  <p className="mt-1 text-sm text-muted">
                    {doc.tutorQualification}
                  </p>
                )}
              </div>

              <hr className="my-4 border-border" />

              <ContactButtons
                adId={String(doc._id)}
                phone={doc.phone as string}
                whatsapp={doc.whatsapp as string}
                email={doc.email as string}
              />
            </div>

            {similarAds.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
                  Similar Classes
                </h3>
                <div className="space-y-3">
                  {similarAds.map((ad) => (
                    <Link
                      key={ad._id}
                      href={`/ads/${ad._id}`}
                      className="block rounded-xl border border-border bg-white p-4 transition hover:border-primary/30 hover:shadow-sm"
                    >
                      <span className="text-xs font-semibold text-primary">
                        {ad.subject}
                      </span>
                      <p className="mt-1 text-sm font-semibold text-foreground line-clamp-2">
                        {ad.title}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {ad.tutorName} · {ad.district}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="rounded-xl bg-surface-alt/50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  );
}
