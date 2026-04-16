import Link from "next/link";

export const metadata = {
  title: "Admin Portal",
};

export default function AdminPortalPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center px-4 py-10 sm:px-6">
      <div className="w-full rounded-3xl border border-border bg-white p-8 shadow-sm sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Admin Portal
            </p>
            <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
              Manage ClassAds from a separate admin route
            </h1>
          </div>
          <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
            Route: /admin
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/admin/login" className="rounded-2xl bg-primary px-5 py-4 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md">
            Sign in to Admin
          </Link>
          <Link href="/admin/dashboard" className="rounded-2xl border border-border px-5 py-4 text-center text-sm font-semibold text-foreground transition hover:bg-surface-alt">
            Open Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
