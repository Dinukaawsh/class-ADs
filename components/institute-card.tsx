import Link from "next/link";

export type InstituteCardData = {
  _id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  district: string;
  city?: string;
  subjects: string[];
  description: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  totalCourses?: number;
  isFeatured?: boolean;
  isVerified?: boolean;
};

function shortText(value: string, max = 140): string {
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

export function InstituteCard({ institute }: { institute: InstituteCardData }) {
  const location = [institute.city, institute.district].filter(Boolean).join(", ");

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        institute.isFeatured
          ? "border-primary/40 ring-1 ring-primary/20"
          : "border-border hover:border-primary/25"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-alt">
            {institute.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={institute.logoUrl} alt={institute.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-primary">
                {institute.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{institute.name}</h3>
            <p className="text-sm text-muted">{location || "Sri Lanka"}</p>
          </div>
        </div>
        {institute.isFeatured && (
          <span className="rounded-full bg-warning px-2.5 py-1 text-xs font-bold text-white">
            Featured
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {institute.subjects.slice(0, 4).map((subject) => (
          <span
            key={subject}
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            {subject}
          </span>
        ))}
        {institute.subjects.length > 4 && (
          <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-muted">
            +{institute.subjects.length - 4} more
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">{shortText(institute.description)}</p>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.59 13.41 12 22l-8.59-8.59A5 5 0 0 1 12 5a5 5 0 0 1 8.59 8.41z" />
          </svg>
          {institute.rating?.toFixed(1) ?? "4.5"} ({institute.reviewCount ?? 0} reviews)
        </span>
        <span>{institute.totalCourses ?? 0} courses</span>
        {institute.isVerified && (
          <span className="inline-flex items-center gap-1 text-success">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 12 2 2 4-4" />
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z" />
            </svg>
            Verified
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Link
          href={`/institutes/${institute.slug}`}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
        >
          View Institute
        </Link>
        {institute.phone && (
          <a
            href={`tel:${institute.phone}`}
            className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-alt"
          >
            Contact
          </a>
        )}
        {institute.website && (
          <a
            href={institute.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-primary/25 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
          >
            Visit Website
          </a>
        )}
      </div>
    </article>
  );
}
