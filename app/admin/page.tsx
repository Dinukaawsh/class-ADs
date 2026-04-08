import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";
import { logoutAdmin } from "@/app/actions/auth";
import { approveAd, rejectAd, deleteAd, toggleFeatured } from "@/app/actions/ads";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  await connectToDatabase();

  const pending = await Ad.find({ status: "pending" })
    .sort({ createdAt: -1 })
    .lean();

  const approved = await Ad.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const rejected = await Ad.find({ status: "rejected" })
    .sort({ updatedAt: -1 })
    .limit(10)
    .lean();

  const totalAds = await Ad.countDocuments();
  const totalApproved = await Ad.countDocuments({ status: "approved" });
  const totalFeatured = await Ad.countDocuments({ isFeatured: true });
  const totalPending = pending.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage and moderate class advertisements.
          </p>
        </div>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-alt hover:text-foreground"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Ads" value={totalAds} color="bg-primary/10 text-primary" />
        <StatCard label="Approved" value={totalApproved} color="bg-success/10 text-success" />
        <StatCard label="Pending" value={totalPending} color="bg-warning/10 text-warning" />
        <StatCard label="Featured" value={totalFeatured} color="bg-accent/10 text-accent" />
      </div>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning text-xs font-bold text-white">
            {totalPending}
          </span>
          Pending Review
        </h2>
        {pending.length === 0 ? (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-border px-6 py-10 text-center">
            <p className="font-medium text-foreground">All caught up!</p>
            <p className="mt-1 text-sm text-muted">No pending ads to review.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {pending.map((doc) => {
              const id = String(doc._id);
              return (
                <div
                  key={id}
                  className="rounded-2xl border border-warning/30 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {doc.subject || doc.className}
                    </span>
                    {doc.grade && (
                      <span className="rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-muted">
                        {doc.grade}
                      </span>
                    )}
                    {doc.classType && (
                      <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                        {doc.classType}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">
                    {doc.title}
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted line-clamp-4">
                    {doc.body}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
                    {doc.tutorName && (
                      <span>Tutor: <b className="text-foreground">{doc.tutorName}</b></span>
                    )}
                    {doc.district && <span>District: {doc.district}</span>}
                    {doc.phone && <span>Phone: {doc.phone}</span>}
                    {doc.whatsapp && <span>WhatsApp: {doc.whatsapp}</span>}
                    {doc.price && <span>Fee: Rs. {doc.price}</span>}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <form action={approveAd.bind(null, id)}>
                      <button
                        type="submit"
                        className="rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white transition hover:bg-success/90"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={rejectAd.bind(null, id)}>
                      <button
                        type="submit"
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-alt"
                      >
                        Reject
                      </button>
                    </form>
                    <form action={deleteAd.bind(null, id)}>
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-bold text-foreground">
          Approved Listings ({totalApproved})
        </h2>
        {approved.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No approved ads yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-alt/50 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Title</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Subject</th>
                  <th className="hidden px-4 py-3 md:table-cell">Tutor</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {approved.map((doc) => {
                  const id = String(doc._id);
                  return (
                    <tr key={id} className="hover:bg-surface-alt/30 transition">
                      <td className="px-4 py-3">
                        <Link
                          href={`/ads/${id}`}
                          className="font-medium text-foreground hover:text-primary transition"
                        >
                          {doc.title}
                        </Link>
                        <p className="text-xs text-muted">
                          {doc.views ?? 0} views · {doc.contactClicks ?? 0} clicks
                        </p>
                      </td>
                      <td className="hidden px-4 py-3 text-muted sm:table-cell">
                        {doc.subject || doc.className}
                      </td>
                      <td className="hidden px-4 py-3 text-muted md:table-cell">
                        {doc.tutorName}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <form action={toggleFeatured.bind(null, id)}>
                          <button
                            type="submit"
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                              doc.isFeatured
                                ? "bg-warning text-white"
                                : "border border-border text-muted hover:border-warning hover:text-warning"
                            }`}
                          >
                            {doc.isFeatured ? "★ Featured" : "☆ Feature"}
                          </button>
                        </form>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <form action={deleteAd.bind(null, id)} className="inline">
                          <button
                            type="submit"
                            className="text-xs font-medium text-red-500 transition hover:text-red-700"
                          >
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {rejected.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-foreground">
            Recently Rejected
          </h2>
          <div className="mt-4 space-y-2">
            {rejected.map((doc) => (
              <div
                key={String(doc._id)}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted">
                    {doc.subject || doc.className} · {doc.tutorName}
                  </p>
                </div>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                  Rejected
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}
