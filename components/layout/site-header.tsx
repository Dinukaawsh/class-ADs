"use client";

import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            CA
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            ClassAds
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/search">Find Classes</NavLink>
          <NavLink href="/institutes">Institutes</NavLink>
          <NavLink href="/submit">Post an Ad</NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/submit"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d97706] hover:shadow-md active:scale-[0.98]"
          >
            Post Your Class
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition hover:bg-surface-alt md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="animate-fade-in border-t border-border bg-white px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            <MobileNavLink href="/" onClick={() => setMobileOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/search" onClick={() => setMobileOpen(false)}>
              Find Classes
            </MobileNavLink>
            <MobileNavLink href="/institutes" onClick={() => setMobileOpen(false)}>
              Institutes
            </MobileNavLink>
            <MobileNavLink href="/submit" onClick={() => setMobileOpen(false)}>
              Post an Ad
            </MobileNavLink>
          </nav>
          <Link
            href="/submit"
            onClick={() => setMobileOpen(false)}
            className="mt-3 block w-full rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#d97706]"
          >
            Post Your Class
          </Link>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary-light hover:text-primary-dark"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-lg px-3 py-2.5 text-sm font-medium text-primary transition hover:bg-primary-light hover:text-primary-dark"
    >
      {children}
    </Link>
  );
}
