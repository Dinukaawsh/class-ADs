import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Institute } from "@/models/Institute";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Institute Dashboard",
  description: "Manage institute listings, courses, and profile details.",
};

export default async function InstituteDashboardPage() {
  await connectToDatabase();
  const institutes = await Institute.find({}).sort({ createdAt: -1 }).limit(30).lean();
  const totalInstitutes = await Institute.countDocuments();
  const totalFeatured = await Institute.countDocuments({ isFeatured: true });
  const totalVerified = await Institute.countDocuments({ isVerified: true });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Institute Dashboard</h1>
        </div>
        <Link href="/institutes/new" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark">
          Add New Institute
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Institutes" value={totalInstitutes} />
        <StatCard label="Verified" value={totalVerified} />
        <StatCard label="Featured" value={totalFeatured} />
        <StatCard label="Profiles Shown" value={institutes.length} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}
