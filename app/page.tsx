import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { listPublishedAds } from "@/lib/ads";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const ads = await listPublishedAds();

  return (
    <div className="min-h-screen bg-[var(--surface-1)]">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <section className="mb-8 rounded-2xl border border-[var(--stroke-1)] bg-[linear-gradient(135deg,var(--brand-50),#fff_40%,var(--accent-50))] p-8">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--brand-700)]">
            Public Marketplace
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--ink-1)] md:text-5xl">
            Buy and sell with trusted local ads.
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--ink-3)]">
            Anyone can view ads. Only admins can create, edit, publish, or remove
            posts.
          </p>
        </section>

        {ads.length === 0 ? (
          <Card>
            <CardContent className="pt-5">
              <p className="text-[var(--ink-3)]">
                No published ads yet. Admin can publish the first one from the
                dashboard.
              </p>
            </CardContent>
          </Card>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => (
              <Card key={ad.id} className="h-full">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge>{ad.category}</Badge>
                    <span className="text-sm font-bold text-[var(--brand-700)]">
                      ${ad.price.toFixed(2)}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 text-xl">{ad.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 line-clamp-3 text-sm text-[var(--ink-3)]">
                    {ad.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-[var(--ink-3)]">
                      {ad.location}
                    </span>
                    <Link
                      href={`/ads/${ad.slug}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "h-8 px-0 text-[var(--brand-700)] hover:bg-transparent hover:underline"
                      )}
                    >
                      View details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
