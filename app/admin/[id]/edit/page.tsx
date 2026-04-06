import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { AdForm } from "@/components/admin/ad-form";
import { getAdminSession } from "@/lib/auth";
import { getAdById } from "@/lib/ads";

import { updateAdAction } from "../../actions";

type EditAdPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditAdPage({ params, searchParams }: EditAdPageProps) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const ad = await getAdById(id);
  const paramsData = await searchParams;
  const errorMessage = typeof paramsData.error === "string" ? paramsData.error : null;

  if (!ad) {
    redirect("/admin");
  }

  const action = updateAdAction.bind(null, id);

  return (
    <div className="min-h-screen bg-[var(--surface-1)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6">
        <AdForm
          title="Edit Ad"
          ad={ad}
          action={action}
          submitLabel="Save Changes"
          errorMessage={errorMessage}
        />
      </main>
    </div>
  );
}
