import Link from "next/link";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with ClassAds support.",
};

function normalizeWhatsapp(raw: string): string {
  return raw.replace(/\D/g, "");
}

export default function ContactPage() {
  const whatsappRaw = process.env.CONTACT_WHATSAPP_NUMBER ?? "";
  const whatsappNumber = normalizeWhatsapp(whatsappRaw);
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Contact Us
      </h1>
      <p className="mt-3 text-sm text-muted">
        Need help with posting ads or account access? Reach us directly on
        WhatsApp.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <p className="text-sm text-muted">WhatsApp Support</p>
        <p className="mt-2 text-lg font-semibold text-foreground">
          {whatsappRaw || "Not configured"}
        </p>
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary"
          >
            Chat on WhatsApp
          </a>
        ) : (
          <p className="mt-4 text-sm text-red-600">
            Add `CONTACT_WHATSAPP_NUMBER` in environment to enable direct chat.
          </p>
        )}
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="text-sm font-semibold text-primary transition hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
