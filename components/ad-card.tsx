import Link from "next/link";

export type AdCardData = {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  district: string;
  city?: string;
  classType: string;
  imageUrl?: string;
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
      className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        ad.isFeatured
          ? "border-primary/30 ring-1 ring-primary/20"
          : "border-border hover:border-primary/20"
      }`}
    >
      {ad.imageUrl && (
        <div className="-mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl border-b border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      {ad.isFeatured && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-warning px-3 py-0.5 text-xs font-bold text-white shadow-sm">
          Featured
        </span>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {ad.subject || ad.className}
        </span>
        <span className="inline-flex items-center rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-muted">
          {ad.grade}
        </span>
        <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
          {ad.classType}
        </span>
      </div>

      <h2 className="mt-3 text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
        <Link
          href={`/ads/${ad._id}`}
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-alt"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6.2 6.2l1.4-1.3a2 2 0 0 1 2.1-.5c.9.3 1.7.5 2.6.7A2 2 0 0 1 22 16.9z" />
            </svg>
            Call
          </a>
        )}
        {ad.whatsapp && (
          <a
            href={`https://wa.me/${ad.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/5 px-4 py-2 text-xs font-semibold text-success transition hover:bg-success/10"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.2-5A8.5 8.5 0 1 1 21 11.5z" />
            </svg>
            WhatsApp
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
