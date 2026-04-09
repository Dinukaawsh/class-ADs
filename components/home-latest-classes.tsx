"use client";

import Link from "next/link";
import { AdCard, type AdCardData } from "@/components/ad-card";
import { useHomeGradeFilter } from "@/components/home-grade-filter-context";

type Props = {
  recentAds: AdCardData[];
};

/** One row on desktop: same height for all cells; side columns narrower, center wider. */
const PREMIUM_ROW_LG =
  "grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)_minmax(0,1fr)] lg:items-stretch lg:gap-6 lg:h-[360px]";

function PremiumSideCard({ index }: { index: number }) {
  const n = index + 1;
  return (
    <Link
      href="/advertise"
      className="group flex min-h-[240px] h-full w-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md lg:min-h-0"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-[120px] flex-1 items-center justify-center border-b border-border bg-surface-alt/50 lg:min-h-0">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="text-muted"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m9 12 2 2 4-4 3 3" />
            <circle cx="8" cy="9" r="1" />
          </svg>
        </div>
        <div className="shrink-0 space-y-1.5 p-4">
          <span className="inline-block rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-white">
            Sponsored
          </span>
          <p className="text-base font-semibold text-foreground">Premium Banner {n}</p>
          <p className="text-xs leading-snug text-muted sm:text-sm">
            Reserve this slot — contact us.
          </p>
        </div>
      </div>
    </Link>
  );
}

function PremiumHorizontalBanner() {
  return (
    <Link
      href="/advertise"
      className="group relative flex min-h-[240px] h-full w-full min-w-0 overflow-hidden rounded-lg border-2 border-primary/30 bg-white shadow-md transition hover:border-primary/50 hover:shadow-lg lg:min-h-0"
    >
      <div className="absolute inset-0 bg-linear-to-r from-primary-light/40 via-white to-primary-light/40" />
      <div className="relative flex h-full min-h-0 w-full flex-col justify-center gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-6">
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Sponsored · Hero placement
          </span>
          <p className="mt-2 text-sm font-medium text-primary-dark">
            Recommended size 1200 × 600 px
          </p>
          <h4 className="mt-1 text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
            Premium horizontal banner
          </h4>
          <p className="mt-2 text-sm text-muted">
            High-visibility horizontal slot for institutes and major campaigns.
          </p>
        </div>
        <div className="shrink-0 self-start rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition group-hover:bg-primary/10 sm:self-center sm:px-5 sm:py-3.5">
          Contact for this slot →
        </div>
      </div>
    </Link>
  );
}

function PremiumBannerRow({
  leftIndex,
  rightIndex,
}: {
  leftIndex: number;
  rightIndex: number;
}) {
  return (
    <div className={PREMIUM_ROW_LG}>
      <PremiumSideCard index={leftIndex} />
      <PremiumHorizontalBanner />
      <PremiumSideCard index={rightIndex} />
    </div>
  );
}

export function HomeLatestClasses({ recentAds }: Props) {
  const { selectedGrade } = useHomeGradeFilter();

  const filtered = selectedGrade
    ? recentAds.filter((ad) => ad.grade === selectedGrade)
    : recentAds;

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Latest Classes</h2>
        <Link
          href="/search"
          className="text-sm font-semibold text-primary hover:underline sm:text-base"
        >
          Browse all →
        </Link>
      </div>

      {selectedGrade && (
        <p className="mt-2 text-sm text-muted">
          Showing classes for{" "}
          <span className="font-semibold text-foreground">{selectedGrade}</span>
          {" · "}
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted">
          Premium Banners
        </h3>
        <div className="mt-3 space-y-5 lg:space-y-6">
          <PremiumBannerRow leftIndex={0} rightIndex={1} />
          <PremiumBannerRow leftIndex={2} rightIndex={3} />
          <PremiumBannerRow leftIndex={4} rightIndex={5} />
        </div>
      </div>

      {recentAds.length === 0 ? (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-border px-6 py-16 text-center">
          <p className="text-lg font-semibold text-foreground">
            No classes listed yet
          </p>
          <p className="mt-2 text-sm text-muted">
            Be the first to post a tuition class and reach students across Sri
            Lanka.
          </p>
          <Link
            href="/submit"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Post Your Class
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-white px-6 py-12 text-center shadow-sm">
          <p className="font-semibold text-foreground">
            No classes match this grade filter
          </p>
          <p className="mt-2 text-sm text-muted">
            Try another grade or choose View All to see every listing.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filtered.map((ad) => (
            <AdCard key={ad._id} ad={ad} />
          ))}
        </div>
      )}
    </section>
  );
}
