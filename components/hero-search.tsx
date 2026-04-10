"use client";

import { useRouter } from "next/navigation";
import { useHomeSearchFilter } from "@/components/home-search-filter-context";
import {
  StyledFilterSelect,
  type FilterSelectOption,
} from "@/components/styled-filter-select";
import { SUBJECTS, GRADES, DISTRICTS } from "@/lib/constants";

const HERO_SUBJECT_OPTIONS: FilterSelectOption[] = [
  { value: "", label: "All Subjects" },
  ...SUBJECTS.map((s) => ({ value: s, label: s })),
];
const HERO_GRADE_OPTIONS: FilterSelectOption[] = [
  { value: "", label: "All Grades" },
  ...GRADES.map((g) => ({ value: g, label: g })),
];
const HERO_DISTRICT_OPTIONS: FilterSelectOption[] = [
  { value: "", label: "All Districts" },
  ...DISTRICTS.map((d) => ({ value: d, label: d })),
];

export function HeroSearch() {
  const router = useRouter();
  const { query, setQuery, subject, setSubject, grade, setGrade, district, setDistrict } =
    useHomeSearchFilter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (subject) params.set("subject", subject);
    if (grade) params.set("grade", grade);
    if (district) params.set("district", district);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <section className="relative z-10 bg-linear-to-br from-primary via-primary-dark to-[#1e1b4b] px-4 py-16 text-white sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Find the Best Tuition Classes
          <span className="mt-2 block text-accent-light">in Sri Lanka</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-medium text-white/85 sm:text-2xl">
          Search thousands of tuition classes by subject, grade, or location.
          Connect with qualified tutors instantly.
        </p>

        <form
          onSubmit={handleSearch}
          className="relative z-20 mx-auto mt-8 max-w-3xl rounded-2xl bg-white/10 p-2 backdrop-blur-sm sm:p-3"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Search by keyword, subject, or tutor..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-xl bg-white px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-accent/90 active:scale-[0.98] sm:shrink-0"
            >
              Search
            </button>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-2">
            <StyledFilterSelect
              variant="hero"
              value={subject}
              onChange={setSubject}
              options={HERO_SUBJECT_OPTIONS}
            />
            <StyledFilterSelect
              variant="hero"
              value={grade}
              onChange={setGrade}
              options={HERO_GRADE_OPTIONS}
            />
            <StyledFilterSelect
              variant="hero"
              value={district}
              onChange={setDistrict}
              options={HERO_DISTRICT_OPTIONS}
            />
          </div>
        </form>
      </div>
    </section>
  );
}
