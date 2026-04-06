import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { AdForm } from "@/components/admin/ad-form";
import { getAdminSession } from "@/lib/auth";

import { createAdAction } from "../actions";

type NewAdPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewAdPage({ searchParams }: NewAdPageProps) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const errorMessage = typeof params.error === "string" ? params.error : null;

  return (
    <div className="min-h-screen bg-[var(--surface-1)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6">
        <AdForm
          title="Create New Ad"
          action={createAdAction}
          submitLabel="Publish Ad"
          errorMessage={errorMessage}
        />
      </main>
    </div>
  );
}
