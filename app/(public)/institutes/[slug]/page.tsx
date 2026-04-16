import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { Institute } from "@/models/Institute";
import { incrementInstituteViews } from "@/app/actions/institutes";
import { InstituteContactActions } from "@/components/institutes/contact-actions";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const institute = await Institute.findOne({ slug, status: "approved" }).lean();
  if (!institute) return { title: "Institute not found" };
  return { title: `${institute.name} - Institute Profile` };
}

export default async function InstituteProfilePage({ params }: Props) {
  const { slug } = await params;
  await connectToDatabase();
  const institute = await Institute.findOne({ slug, status: "approved" }).lean();
  if (!institute) notFound();
  incrementInstituteViews(String(institute._id));
  const location = [institute.city, institute.district].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link href="/institutes" className="inline-flex items-center gap-1 text-sm font-medium text-muted transition hover:text-primary">Back to Institutes</Link>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{String(institute.name)}</h1>
          <p className="mt-1 text-sm text-muted">{location || "Sri Lanka"}</p>
        </div>
        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Contact Institute</h2>
            <div className="mt-4">
              <InstituteContactActions
                instituteId={String(institute._id)}
                phone={String(institute.phone ?? "")}
                whatsapp={String(institute.whatsapp ?? "")}
                email={String(institute.email ?? "")}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
