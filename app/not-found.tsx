import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface-1)] px-4">
      <div className="max-w-md rounded-xl border border-[var(--stroke-1)] bg-white p-8 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--brand-700)]">
          404
        </p>
        <h1 className="mt-2 text-2xl font-black text-[var(--ink-1)]">Ad not found</h1>
        <p className="mt-3 text-sm text-[var(--ink-3)]">
          This ad may have been removed or is not published.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
