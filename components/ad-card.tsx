import Link from "next/link";

export type AdCardData = {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  district: string;
  city?: string;
  classType: string;
  price?: string;
  tutorName: string;
  tutorQualification?: string;
  phone?: string;
  whatsapp?: string;
  isFeatured?: boolean;
  createdAt: string;
  body: string;
  // Legacy
  className?: string;
};

export function AdCard({ ad }: { ad: AdCardData }) {
  const preview =
    ad.body.length > 120 ? `${ad.body.slice(0, 120)}…` : ad.body;

  const location = [ad.city, ad.district].filter(Boolean).join(", ");

  return (
    <article
      className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 dark:bg-surface ${
        ad.isFeatured
          ? "border-primary/30 ring-1 ring-primary/20"
          : "border-border hover:border-primary/20"
      }`}
    >
      {ad.isFeatured && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-warning px-3 py-0.5 text-xs font-bold text-white shadow-sm">
          Featured
        </span>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:text-primary-light">
          {ad.subject || ad.className}
        </span>
        <span className="inline-flex items-center rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-muted">
          {ad.grade}
        </span>
        <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent dark:text-accent-light">
          {ad.classType}
        </span>
      </div>

      <h2 className="mt-3 text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
        <Link
          href={`/ads/${ad._id}`}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {ad.title}
        </Link>
      </h2>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
        {preview}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        <span className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
          <span className="font-medium text-foreground">{ad.tutorName}</span>
        </span>
        {location && (
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {location}
          </span>
        )}
        {ad.price && (
          <span className="flex items-center gap-1 font-semibold text-success">
            Rs. {ad.price}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Link
          href={`/ads/${ad._id}`}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
        >
          View Details
        </Link>
        {ad.phone && (
          <a
            href={`tel:${ad.phone}`}
            className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-alt"
          >
            📞 Call
          </a>
        )}
        {ad.whatsapp && (
          <a
            href={`https://wa.me/${ad.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-success/30 bg-success/5 px-4 py-2 text-xs font-semibold text-success transition hover:bg-success/10"
          >
            💬 WhatsApp
          </a>
        )}
        <span className="ml-auto text-xs text-muted">
          {new Date(ad.createdAt).toLocaleDateString(undefined, {
            dateStyle: "medium",
          })}
        </span>
      </div>
    </article>
  );
}
