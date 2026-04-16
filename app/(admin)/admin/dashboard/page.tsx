import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";
import { logoutAdmin } from "@/app/actions/auth";
import { approveAd, rejectAd, deleteAd, toggleFeatured } from "@/app/actions/ads";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  await connectToDatabase();
  const pending = await Ad.find({ status: "pending" }).sort({ createdAt: -1 }).lean();
  const approved = await Ad.find({ status: "approved" }).sort({ createdAt: -1 }).limit(20).lean();
  const totalAds = await Ad.countDocuments();
  const totalApproved = await Ad.countDocuments({ status: "approved" });
  const totalFeatured = await Ad.countDocuments({ isFeatured: true });
  const totalPending = pending.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-alt hover:text-foreground">Portal</Link>
          <form action={logoutAdmin}>
            <button type="submit" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-alt hover:text-foreground">Sign out</button>
          </form>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Ads" value={totalAds} color="bg-primary/10 text-primary" />
        <StatCard label="Approved" value={totalApproved} color="bg-success/10 text-success" />
        <StatCard label="Pending" value={totalPending} color="bg-warning/10 text-warning" />
        <StatCard label="Featured" value={totalFeatured} color="bg-accent/10 text-accent" />
      </div>
      <section className="mt-10 space-y-4">
        {pending.map((doc) => {
          const id = String(doc._id);
          return (
            <div key={id} className="rounded-2xl border border-warning/30 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">{doc.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <form action={approveAd.bind(null, id)}><button type="submit" className="rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white">Approve</button></form>
                <form action={rejectAd.bind(null, id)}><button type="submit" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted">Reject</button></form>
                <form action={deleteAd.bind(null, id)}><button type="submit" className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600">Delete</button></form>
                <form action={toggleFeatured.bind(null, id)}><button type="submit" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted">Feature</button></form>
              </div>
            </div>
          );
        })}
      </section>
      <section className="mt-12">
        <h2 className="text-lg font-bold text-foreground">Approved Listings ({approved.length})</h2>
      </section>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-2 text-3xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}
