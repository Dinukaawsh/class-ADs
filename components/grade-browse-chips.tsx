"use client";

import { useHomeGradeFilter } from "@/components/home-grade-filter-context";

const GRADE_CATEGORIES = [
  { label: "O/L Classes", value: "O/L (Local)" },
  { label: "A/L Classes", value: "A/L (Local)" },
  { label: "Grade 6-11", value: "Grade 6-9" },
  { label: "Grade 1-5", value: "Grade 1-5" },
] as const;

export function GradeBrowseChips() {
  const { selectedGrade, toggleGrade, setSelectedGrade } = useHomeGradeFilter();

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4">
      {GRADE_CATEGORIES.map((cat) => {
        const active = selectedGrade === cat.value;
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => toggleGrade(cat.value)}
            className={`rounded-full border px-6 py-3 text-base font-semibold shadow-sm transition ${
              active
                ? "border-primary bg-primary/10 text-primary-dark"
                : "border-border bg-white text-foreground hover:border-primary hover:text-primary hover:shadow-md"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => setSelectedGrade(null)}
        className={`rounded-full border px-6 py-3 text-base font-semibold transition ${
          selectedGrade === null
            ? "border-primary bg-primary/10 text-primary-dark"
            : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
        }`}
      >
        View All →
      </button>
    </div>
  );
}
