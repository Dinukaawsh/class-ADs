"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function SiteHeader({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/nana.png"
            alt="NenaMaga logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="text-xl font-extrabold tracking-tight text-primary-dark sm:text-2xl">
            NanaMaga
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/search">Find Classes</NavLink>
          <NavLink href="/institutes">Institutes</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          <NavLink href="/submit">Post an Ad</NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isLoggedIn && (
            <Link
              href="/auth/login"
              className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              Login
            </Link>
          )}
          {isLoggedIn && (
            <Link
              href="/account/ads"
              className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              My Ads
            </Link>
          )}
          <Link
            href="/submit"
            className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition hover:bg-black hover:text-white hover:shadow-md active:scale-[0.98]"
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
            <MobileNavLink href="/contact" onClick={() => setMobileOpen(false)}>
              Contact
            </MobileNavLink>
            <MobileNavLink href="/submit" onClick={() => setMobileOpen(false)}>
              Post an Ad
            </MobileNavLink>
          </nav>
          {!isLoggedIn && (
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="mt-3 block w-full rounded-lg border border-border bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              Login
            </Link>
          )}
          {isLoggedIn && (
            <Link
              href="/account/ads"
              onClick={() => setMobileOpen(false)}
              className="mt-3 block w-full rounded-lg border border-border bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              My Ads
            </Link>
          )}
          <Link
            href="/submit"
            onClick={() => setMobileOpen(false)}
            className="mt-3 block w-full rounded-lg border border-border bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-black hover:text-white"
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
      className="rounded-lg border border-transparent bg-white px-3 py-2 text-sm font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
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
      className="rounded-lg border border-transparent bg-white px-3 py-2.5 text-sm font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
    >
      {children}
    </Link>
  );
}
