import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";
import { Institute } from "@/models/Institute";
import { logoutAdmin } from "@/app/actions/auth";
import {
  approveAd,
  rejectAd,
  deleteAd,
  toggleFeatured,
  updateAdByAdminFromForm,
} from "@/app/actions/ads";
import {
  deleteInstituteByAdmin,
  updateInstituteByAdminFromForm,
} from "@/app/actions/institutes";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  await connectToDatabase();
  const pending = await Ad.find({ status: "pending" }).sort({ createdAt: -1 }).lean();
  const approved = await Ad.find({ status: "approved" }).sort({ createdAt: -1 }).limit(20).lean();
  const institutes = await Institute.find({}).sort({ createdAt: -1 }).limit(20).lean();
  const totalAds = await Ad.countDocuments();
  const totalApproved = await Ad.countDocuments({ status: "approved" });
  const totalFeatured = await Ad.countDocuments({ isFeatured: true });
  const totalPending = pending.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-3">
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
                <form action={deleteAd.bind(null, id)}>
                  <ConfirmSubmitButton
                    label="Delete"
                    title="Delete this ad?"
                    message="This action cannot be undone."
                    confirmLabel="Delete"
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                  />
                </form>
                <form action={toggleFeatured.bind(null, id)}><button type="submit" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted">Feature</button></form>
              </div>
              <details className="mt-4 rounded-xl border border-border p-3">
                <summary className="cursor-pointer text-sm font-semibold text-foreground">Edit ad</summary>
                <form action={updateAdByAdminFromForm.bind(null, id)} className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input name="title" defaultValue={String(doc.title ?? "")} className={fieldClass} placeholder="Title" />
                  <input name="subject" defaultValue={String(doc.subject ?? "")} className={fieldClass} placeholder="Subject" />
                  <input name="grade" defaultValue={String(doc.grade ?? "")} className={fieldClass} placeholder="Grade" />
                  <input name="district" defaultValue={String(doc.district ?? "")} className={fieldClass} placeholder="District" />
                  <input name="classType" defaultValue={String(doc.classType ?? "")} className={fieldClass} placeholder="Class type" />
                  <input name="tutorName" defaultValue={String(doc.tutorName ?? "")} className={fieldClass} placeholder="Tutor name" />
                  <input name="price" defaultValue={String(doc.price ?? "")} className={fieldClass} placeholder="Price" />
                  <textarea name="body" defaultValue={String(doc.body ?? "")} className={`${fieldClass} sm:col-span-2`} rows={3} />
                  <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white sm:col-span-2">Save changes</button>
                </form>
              </details>
            </div>
          );
        })}
      </section>
      <section className="mt-12">
        <h2 className="text-lg font-bold text-foreground">Approved Listings ({approved.length})</h2>
      </section>
      <section className="mt-12">
        <h2 className="text-lg font-bold text-foreground">Institutes ({institutes.length})</h2>
        <div className="mt-4 space-y-4">
          {institutes.map((institute) => {
            const id = String(institute._id);
            return (
              <div key={id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground">{String(institute.name ?? "")}</h3>
                  <form action={deleteInstituteByAdmin.bind(null, id)}>
                    <ConfirmSubmitButton
                      label="Delete"
                      title="Delete this institute?"
                      message="This will remove the institute profile."
                      confirmLabel="Delete"
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                    />
                  </form>
                </div>
                <details className="mt-4 rounded-xl border border-border p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-foreground">Edit institute</summary>
                  <form action={updateInstituteByAdminFromForm.bind(null, id)} className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input name="name" defaultValue={String(institute.name ?? "")} className={fieldClass} placeholder="Name" />
                    <input name="district" defaultValue={String(institute.district ?? "")} className={fieldClass} placeholder="District" />
                    <input name="city" defaultValue={String(institute.city ?? "")} className={fieldClass} placeholder="City" />
                    <input name="phone" defaultValue={String(institute.phone ?? "")} className={fieldClass} placeholder="Phone" />
                    <input name="whatsapp" defaultValue={String(institute.whatsapp ?? "")} className={fieldClass} placeholder="WhatsApp" />
                    <input
                      name="classModes"
                      defaultValue={Array.isArray(institute.classModes) ? institute.classModes.join(", ") : ""}
                      className={fieldClass}
                      placeholder="Class modes"
                    />
                    <textarea name="description" defaultValue={String(institute.description ?? "")} className={`${fieldClass} sm:col-span-2`} rows={3} />
                    <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white sm:col-span-2">Save changes</button>
                  </form>
                </details>
              </div>
            );
          })}
        </div>
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

const fieldClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground";
