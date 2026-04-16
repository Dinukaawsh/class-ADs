import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";

function formatCount(value: number): string {
  if (value >= 1000) return `${Math.floor(value / 100) / 10}k+`;
  return String(value);
}

export async function StatsBar() {
  await connectToDatabase();

  const [totalClasses, tutorNames, districts, subjects] = await Promise.all([
    Ad.countDocuments({ status: "approved" }),
    Ad.distinct("tutorName", { status: "approved", tutorName: { $ne: "" } }),
    Ad.distinct("district", { status: "approved", district: { $ne: "" } }),
    Ad.distinct("subject", { status: "approved", subject: { $ne: "" } }),
  ]);

  return (
    <section className="relative z-0 border-y border-border bg-surface-alt/50">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:py-10">
        <Stat value={formatCount(totalClasses)} label="Active Classes" />
        <Stat value={formatCount(tutorNames.length)} label="Active Tutors" />
        <Stat value={formatCount(districts.length)} label="Districts Covered" />
        <Stat value={formatCount(subjects.length)} label="Subjects Available" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-extrabold text-primary sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-muted sm:text-sm">
        {label}
      </p>
    </div>
  );
}
