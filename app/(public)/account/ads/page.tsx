import { redirect } from "next/navigation";
import { getUserFromCookies } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";
import { logoutUser } from "@/app/actions/user-auth";
import { MyAdsManager } from "@/components/ads/my-ads-manager";

export const dynamic = "force-dynamic";

export default async function MyAdsPage() {
  const user = await getUserFromCookies();
  if (!user?.sub) redirect("/auth/login");

  await connectToDatabase();
  const ads = await Ad.find({ ownerUserId: String(user.sub) }).sort({ createdAt: -1 }).lean();
  const preparedAds = ads.map((doc) => ({
    _id: String(doc._id),
    title: String(doc.title ?? ""),
    subject: String(doc.subject ?? ""),
    grade: String(doc.grade ?? ""),
    district: String(doc.district ?? ""),
    classType: String(doc.classType ?? ""),
    tutorName: String(doc.tutorName ?? ""),
    price: String(doc.price ?? ""),
    body: String(doc.body ?? ""),
    status: String(doc.status ?? "pending"),
    createdAt:
      (doc.createdAt as Date)?.toISOString?.() ?? new Date().toISOString(),
  }));

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

      <MyAdsManager ads={preparedAds} />
    </div>
  );
}
