import Link from "next/link";
import { FEATURED_SUBJECTS, SUBJECT_ICONS } from "@/lib/constants";

const GRADE_CATEGORIES = [
  { label: "O/L Classes", value: "O/L (Local)" },
  { label: "A/L Classes", value: "A/L (Local)" },
  { label: "Grade 6-11", value: "Grade 6-9" },
  { label: "Grade 1-5", value: "Grade 1-5" },
];

export function CategoryCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
        Browse by Subject
      </h2>
      <p className="mt-2 text-center text-muted">
        Find the right class for your needs
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
        {FEATURED_SUBJECTS.map((subj) => (
          <Link
            key={subj}
            href={`/search?subject=${encodeURIComponent(subj)}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 dark:bg-surface"
          >
            <span className="text-3xl">
              {SUBJECT_ICONS[subj] ?? "📚"}
            </span>
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {subj}
            </span>
          </Link>
        ))}
      </div>

      <h3 className="mt-12 text-center text-lg font-bold text-foreground">
        Browse by Grade
      </h3>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {GRADE_CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={`/search?grade=${encodeURIComponent(cat.value)}`}
            className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md dark:bg-surface"
          >
            {cat.label}
          </Link>
        ))}
        <Link
          href="/search"
          className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/10"
        >
          View All →
        </Link>
      </div>
    </section>
  );
}
