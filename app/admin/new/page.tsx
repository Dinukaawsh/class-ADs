import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { AdForm } from "@/components/admin/ad-form";
import { getAdminSession } from "@/lib/auth";

import { createAdAction } from "../actions";

export default async function NewAdPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--surface-1)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6">
        <AdForm title="Create New Ad" action={createAdAction} submitLabel="Publish Ad" />
      </main>
    </div>
  );
}
