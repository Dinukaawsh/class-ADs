import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdBySlug } from "@/lib/ads";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const ad = await getAdBySlug(slug);

  if (!ad) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--surface-1)]">
      <SiteHeader />

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-[2fr_1fr] md:px-6">
        <Card>
          <CardHeader>
            <div className="mb-3 flex items-center justify-between">
              <Badge>{ad.category}</Badge>
              <span className="text-xl font-black text-[var(--brand-700)]">
                ${ad.price.toFixed(2)}
              </span>
            </div>
            <CardTitle className="text-3xl">{ad.title}</CardTitle>
            <p className="mt-2 text-sm text-[var(--ink-3)]">{ad.location}</p>
          </CardHeader>
          <CardContent>
            <p className="mb-5 text-[var(--ink-2)]">{ad.summary}</p>
            <article className="whitespace-pre-wrap text-[var(--ink-2)]">
              {ad.description}
            </article>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Seller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Name:</strong> {ad.contactName}
            </p>
            <p>
              <strong>Email:</strong> {ad.contactEmail}
            </p>
            <p>
              <strong>Phone:</strong> {ad.phone}
            </p>
            <div className="pt-3">
              <Button asChild variant="secondary">
                <Link href="/">Back to ads</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
