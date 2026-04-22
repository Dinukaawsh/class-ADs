import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white px-4 py-10 text-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/nana.png"
              alt="NanaMaga logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="text-xl font-extrabold tracking-tight text-primary-dark">
              NanaMaga
            </span>
          </div>
          <p className="mt-3 text-sm text-foreground/75">
            Sri Lanka&apos;s tuition class marketplace. Find classes or promote your teaching.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground/75">
            <li><Link href="/search" className="hover:text-primary transition">Find Classes</Link></li>
            <li><Link href="/institutes" className="hover:text-primary transition">Institutes</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">Post with Confidence</h4>
          <p className="mt-3 text-sm text-foreground/75">
            Every ad submission includes human verification to reduce spam.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-border pt-6 text-center text-xs text-foreground/70">
        © {new Date().getFullYear()} NanaMaga. All rights reserved.
      </div>
    </footer>
  );
}
