import Link from "next/link";

export type AdCardData = {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  district: string;
  city?: string;
  mapLocationUrl?: string;
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
  const location = [ad.city, ad.district].filter(Boolean).join(", ");
  const callHref = ad.phone
    ? `tel:${ad.phone}`
    : ad.whatsapp
      ? `https://wa.me/${ad.whatsapp.replace(/\D/g, "")}`
      : undefined;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        ad.isFeatured
          ? "border-primary/30 ring-1 ring-primary/20"
          : "border-border hover:border-primary/20"
      }`}
    >
      <div className="relative">
        {ad.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="h-[240px] w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-[240px] w-full bg-gradient-to-br from-zinc-100 to-zinc-300" />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-black/90 via-black/65 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        <div className="absolute inset-x-0 bottom-0 translate-y-6 p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-black">
              {ad.subject || ad.className}
            </span>
            {callHref && (
              <a
                href={callHref}
                target={ad.phone ? undefined : "_blank"}
                rel={ad.phone ? undefined : "noopener noreferrer"}
                className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-black"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6.2 6.2l1.4-1.3a2 2 0 0 1 2.1-.5c.9.3 1.7.5 2.6.7A2 2 0 0 1 22 16.9z" />
                </svg>
                Call
              </a>
            )}
            {location && (
              ad.mapLocationUrl ? (
                <a
                  href={ad.mapLocationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-black"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  {location}
                </a>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-black">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  {location}
                </span>
              )
            )}
          </div>

          <Link
            href={`/ads/${ad._id}`}
            className="pointer-events-auto inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            View More
          </Link>
        </div>
      </div>
    </article>
  );
}
