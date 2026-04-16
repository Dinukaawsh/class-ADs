import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserFromCookies } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";
import { updateOwnAd, requestDeleteAdOtp, confirmDeleteOwnAd } from "@/app/actions/ads";
import { logoutUser } from "@/app/actions/user-auth";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";

export const dynamic = "force-dynamic";

export default async function MyAdsPage() {
  const user = await getUserFromCookies();
  if (!user?.sub) redirect("/auth/login");

  await connectToDatabase();
  const ads = await Ad.find({ ownerUserId: String(user.sub) }).sort({ createdAt: -1 }).lean();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">My Ads</h1>
        <form action={logoutUser}>
          <button type="submit" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted">
            Logout
          </button>
        </form>
      </div>
      <p className="mt-1 text-sm text-muted">{ads.length} ad(s)</p>

      <div className="mt-6 space-y-4">
        {ads.map((doc) => {
          const id = String(doc._id);
          return (
            <div key={id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground">{String(doc.title)}</h2>
                <Link href={`/ads/${id}`} className="text-sm font-semibold text-primary hover:underline">View</Link>
              </div>
              <p className="mt-1 text-xs text-muted">Status: {String(doc.status)}</p>

              <details className="mt-4 rounded-xl border border-border p-3">
                <summary className="cursor-pointer text-sm font-semibold text-foreground">Edit your ad</summary>
                <form action={updateOwnAd.bind(null, id)} className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input name="title" defaultValue={String(doc.title ?? "")} className={field} />
                  <input name="subject" defaultValue={String(doc.subject ?? "")} className={field} />
                  <input name="grade" defaultValue={String(doc.grade ?? "")} className={field} />
                  <input name="district" defaultValue={String(doc.district ?? "")} className={field} />
                  <input name="classType" defaultValue={String(doc.classType ?? "")} className={field} />
                  <input name="tutorName" defaultValue={String(doc.tutorName ?? "")} className={field} />
                  <input name="price" defaultValue={String(doc.price ?? "")} className={field} />
                  <textarea name="body" defaultValue={String(doc.body ?? "")} rows={3} className={`${field} sm:col-span-2`} />
                  <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white sm:col-span-2">Save</button>
                </form>
              </details>

              <details className="mt-4 rounded-xl border border-red-200 p-3">
                <summary className="cursor-pointer text-sm font-semibold text-red-600">Delete with OTP confirmation</summary>
                <div className="mt-3 space-y-3">
                  <form action={requestDeleteAdOtp.bind(null, id)}>
                    <button type="submit" className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600">
                      Send OTP to email
                    </button>
                  </form>
                  <form action={confirmDeleteOwnAd.bind(null, id)} className="flex flex-wrap gap-2">
                    <input name="otp" placeholder="Enter OTP" className={field} />
                    <ConfirmSubmitButton
                      label="Confirm Delete"
                      title="Delete your ad?"
                      message="OTP will be verified before deletion."
                      confirmLabel="Delete"
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                    />
                  </form>
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const field = "w-full rounded-lg border border-border px-3 py-2 text-sm";
