import Link from "next/link";

import { getAdminSession } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Public Ads
          </Link>
          {session ? (
            <>
              <Link
                href="/admin"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
              >
                Dashboard
              </Link>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
