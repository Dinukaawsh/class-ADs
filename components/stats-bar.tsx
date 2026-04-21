import { connectToDatabase } from "@/lib/db";
import { Ad } from "@/models/Ad";
import { DISTRICTS, SUBJECTS } from "@/lib/constants";

function formatCount(value: number): string {
  if (value >= 1000) return `${Math.floor(value / 100) / 10}k+`;
  return String(value);
}

export async function StatsBar() {
  let totalClasses = 0;
  let tutorCount = 0;
  let districtCount = 0;
  let subjectCount = 0;

  try {
    await connectToDatabase();
    const activeFilter = { status: { $in: ["approved", "pending"] } };

    const [classes, tutorNames, districts, subjects] = await Promise.all([
      Ad.countDocuments(activeFilter),
      Ad.distinct("tutorName", { ...activeFilter, tutorName: { $ne: "" } }),
      Ad.distinct("district", { ...activeFilter, district: { $ne: "" } }),
      Ad.distinct("subject", { ...activeFilter, subject: { $ne: "" } }),
    ]);

    totalClasses = classes;
    tutorCount = tutorNames.length;
    districtCount = districts.length;
    subjectCount = subjects.length;
  } catch {
    // If DB is unavailable, fall back to static catalog stats.
  }

  // Keep UI meaningful even on fresh DB.
  const fallbackDistricts = DISTRICTS.filter((d) => d !== "All Island").length;
  const safeDistricts = Math.max(districtCount, fallbackDistricts);
  const safeSubjects = Math.max(subjectCount, SUBJECTS.length);

  return (
    <section className="relative z-0 border-y border-[#0a234a] bg-[#0b2a5b]">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:py-10">
        <Stat value={formatCount(totalClasses)} label="Active Classes" />
        <Stat value={formatCount(tutorCount)} label="Active Tutors" />
        <Stat value={formatCount(safeDistricts)} label="Districts Covered" />
        <Stat value={formatCount(safeSubjects)} label="Subjects Available" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-extrabold text-white sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-white/85 sm:text-sm">
        {label}
      </p>
    </div>
  );
}
