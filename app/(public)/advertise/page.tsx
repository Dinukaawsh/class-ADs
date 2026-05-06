import Link from "next/link";
import { getUserFromCookies } from "@/lib/auth";

export const metadata = {
  title: "Post an Ad",
  description: "List your class or reserve premium banner placement on NanaMaga.",
};

const ADS_PHONE_DISPLAY = "076 732 6845";
const ADS_PHONE_E164 = "94767326845";

export default async function AdvertisePage() {
  const user = await getUserFromCookies();
  const isLoggedIn = Boolean(user?.sub);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Post an ad</h1>
      <p className="mt-3 text-sm text-muted">
        Choose how you want to advertise — submit a class listing online, or call us for sponsored premium
        banner slots.
      </p>

      <div className="mt-10 space-y-6">
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Class listing</h2>
          <p className="mt-2 text-sm text-muted">
            Create an account, sign in, and submit your tuition class. Your ad is reviewed before it goes live.
          </p>
          {isLoggedIn ? (
            <Link
              href="/submit"
              className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Continue to post your class
            </Link>
          ) : (
            <Link
              href={`/auth/login?callbackUrl=${encodeURIComponent("/submit")}`}
              className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Log in to post
            </Link>
          )}
          {!isLoggedIn && (
            <p className="mt-3 text-xs text-muted">
              No account?{" "}
              <Link href="/auth/register" className="font-semibold text-primary hover:underline">
                Register
              </Link>
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Premium &amp; banner placement</h2>
          <p className="mt-2 text-balance text-sm text-muted">
            <span lang="en" className="font-sans">
              Normal square slots
            </span>
            <span lang="si" className="font-premium-banner-si">
              {" "}
              සහ{" "}
            </span>
            <span lang="en" className="font-sans">
              premium banner
            </span>
            <span lang="si" className="font-premium-banner-si">
              {" "}
              වෙන්කරවා ගැනීමට අපගේ කණ්ඩායම හා සම්බන්ධ වන්න. ඔබේ ආයතනය හෝ ප්‍රචාරණ වැඩසටහන{" "}
            </span>
            <span lang="en" className="font-sans">
              (Campaign)
            </span>
            <span lang="si" className="font-premium-banner-si">
              {" "}
              සඳහා වැඩි අවධානයක් ලබා ගැනීමට අපට කතා කරන්න හෝ පණිවිඩයක් එවන්න.
            </span>
          </p>
          <a
            href={`tel:+${ADS_PHONE_E164}`}
            className="mt-5 inline-flex rounded-xl border border-border bg-surface-alt px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            Call {ADS_PHONE_DISPLAY}
          </a>
        </section>
      </div>

      <p className="mt-10 text-sm text-muted">
        <Link href="/contact" className="font-semibold text-primary hover:underline">
          Contact page
        </Link>{" "}
        for other support options.
      </p>
    </div>
  );
}
