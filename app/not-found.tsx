import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-16 sm:px-6">
      <div className="w-full rounded-3xl border border-border bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-muted sm:text-base">
          The page you are looking for does not exist or was moved.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Go to Home
          </Link>
          <Link
            href="/search"
            className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-alt"
          >
            Find Classes
          </Link>
        </div>
      </div>
    </div>
  );
}
