import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { Institute } from "@/models/Institute";
import { incrementInstituteViews } from "@/app/actions/institutes";
import { InstituteContactActions } from "./contact-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const institute = await Institute.findOne({ slug, status: "approved" }).lean();
  if (!institute) return { title: "Institute not found" };

  return {
    title: `${institute.name} - Institute Profile`,
    description: String(institute.description ?? "").slice(0, 160),
  };
}

export default async function InstituteProfilePage({ params }: Props) {
  const { slug } = await params;
  await connectToDatabase();
  const institute = await Institute.findOne({ slug, status: "approved" }).lean();
  if (!institute) notFound();

  incrementInstituteViews(String(institute._id));

  const location = [institute.city, institute.district].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent(`${institute.name} ${location}`);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/institutes"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted transition hover:text-primary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Institutes
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-alt">
                  {institute.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={String(institute.logoUrl)} alt={String(institute.name)} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-base font-bold text-primary">
                      {String(institute.name).slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{String(institute.name)}</h1>
                  <p className="mt-1 text-sm text-muted">{location || "Sri Lanka"}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {institute.isFeatured && (
                  <span className="rounded-full bg-warning px-3 py-1 text-xs font-bold text-white">Featured</span>
                )}
                {institute.isVerified && (
                  <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                    Verified Institute
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {((institute.subjects as string[]) ?? []).map((subject) => (
                <span key={subject} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {subject}
                </span>
              ))}
            </div>

            <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {String(institute.description ?? "")}
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">Available Courses</h2>
            {(institute.courses as Array<Record<string, string>>)?.length ? (
              <div className="mt-4 space-y-3">
                {(institute.courses as Array<Record<string, string>>).map((course, idx) => (
                  <div key={`${course.title}-${idx}`} className="rounded-xl border border-border p-4">
                    <p className="font-semibold text-foreground">{course.title || "Course"}</p>
                    <p className="mt-1 text-xs text-muted">
                      {[course.subject, course.level, course.schedule, course.mode].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">Courses will be published soon.</p>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">Tutors / Lecturers</h2>
            {(institute.lecturers as Array<Record<string, string>>)?.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(institute.lecturers as Array<Record<string, string>>).map((lecturer, idx) => (
                  <div key={`${lecturer.name}-${idx}`} className="rounded-xl border border-border p-4">
                    <p className="font-semibold text-foreground">{lecturer.name || "Lecturer"}</p>
                    {lecturer.qualification && (
                      <p className="mt-1 text-xs text-muted">{lecturer.qualification}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">Lecturer details not provided.</p>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">Gallery / Facilities</h2>
            {(institute.galleryImages as string[])?.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(institute.galleryImages as string[]).map((url) => (
                  <div key={url} className="overflow-hidden rounded-xl border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="Institute facility" className="h-40 w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">
                No gallery images yet. Facilities:{" "}
                {((institute.facilities as string[]) ?? []).join(", ") || "Not specified"}.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Institute Stats</h2>
            <div className="mt-4 space-y-2 text-sm text-foreground">
              <p>Rating: {(Number(institute.rating) || 0).toFixed(1)} / 5</p>
              <p>Reviews: {Number(institute.reviewCount) || 0}</p>
              <p>Courses: {Number(institute.totalCourses) || 0}</p>
              <p>Profile Views: {Number(institute.views) || 0}</p>
              <p>Modes: {((institute.classModes as string[]) ?? []).join(", ") || "Physical"}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Contact Institute</h2>
            <div className="mt-4">
              <InstituteContactActions
                instituteId={String(institute._id)}
                phone={String(institute.phone ?? "")}
                whatsapp={String(institute.whatsapp ?? "")}
                email={String(institute.email ?? "")}
              />
            </div>
            {institute.website && (
              <a
                href={String(institute.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary"
              >
                Visit Website
              </a>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Location Map</h2>
            <p className="mt-3 text-sm text-muted">{location || "Sri Lanka"}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-alt"
            >
              Open in Google Maps
            </a>
          </section>
        </aside>
      </div>
    </div>
  );
}
