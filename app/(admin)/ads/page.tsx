import Link from "next/link";

export const metadata = {
  title: "Admin Ads",
};

export default function AdminAdsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">Manage Ads</h1>
      <p className="mt-2 text-sm text-muted">
        Ad-specific tools can be expanded here. Main moderation is available in dashboard.
      </p>
      <Link href="/admin/dashboard" className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
