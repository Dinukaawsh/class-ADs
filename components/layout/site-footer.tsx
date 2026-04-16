import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
              CA
            </div>
            <span className="font-bold text-foreground">ClassAds</span>
          </div>
          <p className="mt-3 text-sm text-muted">
            Sri Lanka&apos;s tuition class marketplace. Find classes or promote your teaching.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/search" className="hover:text-primary transition">Find Classes</Link></li>
            <li><Link href="/institutes" className="hover:text-primary transition">Institutes</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">Post with Confidence</h4>
          <p className="mt-3 text-sm text-muted">
            Every ad submission includes human verification to reduce spam.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-border pt-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} ClassAds. All rights reserved.
      </div>
    </footer>
  );
}
