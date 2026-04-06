import Link from "next/link";

import { getAdminSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const session = await getAdminSession();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--stroke-1)] bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--brand-700)] text-xs font-black text-white">
            AD
          </span>
          <span className="text-sm font-extrabold tracking-wide text-[var(--ink-1)]">
            CityBoard
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Public Ads</Link>
          </Button>
          {session ? (
            <>
              <Button asChild variant="secondary" size="sm">
                <Link href="/admin">Dashboard</Link>
              </Button>
              <form action="/api/auth/logout" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Admin Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
