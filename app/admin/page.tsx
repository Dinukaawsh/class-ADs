import Link from "next/link";
import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteAdAction } from "@/app/admin/actions";
import { getAdminSession } from "@/lib/auth";
import { listAllAds } from "@/lib/ads";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  const ads = await listAllAds();

  return (
    <div className="min-h-screen bg-[var(--surface-1)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--ink-1)]">
              Admin Dashboard
            </h1>
            <p className="text-sm text-[var(--ink-3)]">Create, update, and delete ads.</p>
          </div>
          <Link href="/admin/new" className={cn(buttonVariants())}>
            Create New Ad
          </Link>
        </div>

        <section className="grid gap-4">
          {ads.length === 0 ? (
            <Card>
              <CardContent className="pt-5 text-sm text-[var(--ink-3)]">
                No ads yet. Create your first ad.
              </CardContent>
            </Card>
          ) : (
            ads.map((ad) => (
              <Card key={ad.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{ad.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-[var(--ink-3)]">{ad.summary}</p>
                  <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-3)]">
                    <span>{ad.category}</span>
                    <span>{ad.location}</span>
                    <span>${ad.price.toFixed(2)}</span>
                    <span>{ad.isPublished ? "Published" : "Draft"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/${ad.id}/edit`}
                      className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
                    >
                      Edit
                    </Link>
                    <form action={deleteAdAction}>
                      <input type="hidden" name="id" value={ad.id} />
                      <button
                        type="submit"
                        className={cn(buttonVariants({ variant: "danger", size: "sm" }))}
                      >
                        Delete
                      </button>
                    </form>
                    <Link
                      href={`/ads/${ad.slug}`}
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                    >
                      View Public
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
