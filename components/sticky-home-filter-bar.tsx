"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState, type FormEvent } from "react";
import { useHomeGradeFilter } from "@/components/home-grade-filter-context";
import { useHomeSearchFilter } from "@/components/home-search-filter-context";
import {
  StyledFilterSelect,
  type FilterSelectOption,
} from "@/components/styled-filter-select";
import {
  BROWSE_GRADE_OPTIONS,
  SUBJECTS,
  GRADES,
  DISTRICTS,
} from "@/lib/constants";

const SHOW_AFTER_SCROLL_Y = 200;

const STICKY_SUBJECT_OPTIONS: FilterSelectOption[] = [
  { value: "", label: "All subjects" },
  ...SUBJECTS.map((s) => ({ value: s, label: s })),
];
const STICKY_GRADE_OPTIONS: FilterSelectOption[] = [
  { value: "", label: "All grades" },
  ...GRADES.map((g) => ({ value: g, label: g })),
];
const STICKY_DISTRICT_OPTIONS: FilterSelectOption[] = [
  { value: "", label: "All districts" },
  ...DISTRICTS.map((d) => ({ value: d, label: d })),
];

function ChevronIcon({ up }: { up: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {up ? <path d="M18 15l-6-6-6 6" /> : <path d="M6 9l6 6 6-6" />}
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className ?? "shrink-0 text-muted"}
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SubjectGradeDistrictFields({
  subject,
  setSubject,
  grade,
  setGrade,
  district,
  setDistrict,
  compact,
}: {
  subject: string;
  setSubject: (v: string) => void;
  grade: string;
  setGrade: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
  compact?: boolean;
}) {
  const fieldId = useId();
  const labelClass = compact
    ? "mb-1 block text-[11px] font-bold tracking-wide text-foreground"
    : "mb-1.5 block text-xs font-bold tracking-wide text-foreground";
  const gridClass = compact
    ? "grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-2"
    : "grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3 lg:max-w-xl";

  return (
    <div className={gridClass}>
      <label className="block min-w-0" htmlFor={`${fieldId}-subject`}>
        <span className={labelClass}>Subject</span>
        <StyledFilterSelect
          id={`${fieldId}-subject`}
          compact={compact}
          value={subject}
          onChange={setSubject}
          options={STICKY_SUBJECT_OPTIONS}
        />
      </label>
      <label className="block min-w-0" htmlFor={`${fieldId}-grade`}>
        <span className={labelClass}>Grade (search)</span>
        <StyledFilterSelect
          id={`${fieldId}-grade`}
          compact={compact}
          value={grade}
          onChange={setGrade}
          options={STICKY_GRADE_OPTIONS}
        />
      </label>
      <label className="block min-w-0" htmlFor={`${fieldId}-district`}>
        <span className={labelClass}>District</span>
        <StyledFilterSelect
          id={`${fieldId}-district`}
          compact={compact}
          value={district}
          onChange={setDistrict}
          options={STICKY_DISTRICT_OPTIONS}
        />
      </label>
    </div>
  );
}

export function StickyHomeFilterBar() {
  const router = useRouter();
  const {
    query,
    setQuery,
    subject,
    setSubject,
    grade,
    setGrade,
    district,
    setDistrict,
  } = useHomeSearchFilter();
  const { selectedGrade, toggleGrade, setSelectedGrade } = useHomeGradeFilter();

  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_Y);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (subject) params.set("subject", subject);
      if (grade) params.set("grade", grade);
      if (district) params.set("district", district);
      router.push(`/search?${params.toString()}`);
    },
    [query, subject, grade, district, router]
  );

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-40 border-b border-border bg-white/95 shadow-md backdrop-blur-md transition-[transform,opacity] duration-300 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="relative py-2 sm:py-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="absolute right-0 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition hover:bg-surface-alt sm:top-3"
            aria-expanded={expanded}
            aria-label={expanded ? "Minimize filters" : "Expand filters"}
          >
            <ChevronIcon up={expanded} />
          </button>

          {!expanded ? (
            <div className="flex flex-col gap-3 pr-10 lg:flex-row lg:items-end lg:gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-end sm:gap-2">
                <div className="hidden shrink-0 sm:flex sm:h-[52px] sm:items-end sm:pb-2">
                  <SearchIcon />
                </div>
                <SubjectGradeDistrictFields
                  compact
                  subject={subject}
                  setSubject={setSubject}
                  grade={grade}
                  setGrade={setGrade}
                  district={district}
                  setDistrict={setDistrict}
                />
                <div className="flex shrink-0 items-end sm:pb-0.5">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md"
                  >
                    <SearchIcon className="h-3.5 w-3.5 shrink-0 text-white" />
                    Search
                  </button>
                </div>
              </div>
              <div className="flex min-w-0 flex-wrap items-center gap-2 overflow-x-auto pb-0.5 lg:max-w-[42%] xl:max-w-none">
                <span className="shrink-0 self-center text-xs font-semibold text-muted">
                  Filter:
                </span>
                {BROWSE_GRADE_OPTIONS.map((cat) => {
                  const active = selectedGrade === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggleGrade(cat.value)}
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-primary bg-primary/12 text-primary-dark shadow-sm"
                          : "border-border bg-white text-foreground hover:border-primary"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setSelectedGrade(null)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    selectedGrade === null
                      ? "border-primary bg-primary/12 text-primary-dark shadow-sm"
                      : "border-border bg-white text-foreground hover:border-primary"
                  }`}
                >
                  All
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pr-10">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:gap-3">
                <label className="block min-w-0 flex-1">
                  <span className="mb-1 block text-xs font-semibold text-muted">
                    Search classes
                  </span>
                  <span className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5">
                    <SearchIcon />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Keyword, subject, or tutor…"
                      className="min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground placeholder:text-muted focus:ring-0"
                    />
                  </span>
                </label>
                <SubjectGradeDistrictFields
                  subject={subject}
                  setSubject={setSubject}
                  grade={grade}
                  setGrade={setGrade}
                  district={district}
                  setDistrict={setDistrict}
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="text-xs font-bold text-foreground sm:mr-1">
                  Filter listings:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {BROWSE_GRADE_OPTIONS.map((cat) => {
                    const active = selectedGrade === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => toggleGrade(cat.value)}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold shadow-sm transition sm:text-sm ${
                          active
                            ? "border-primary bg-primary/10 text-primary-dark"
                            : "border-border bg-white text-foreground hover:border-primary"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setSelectedGrade(null)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                      selectedGrade === null
                        ? "border-primary bg-primary/10 text-primary-dark"
                        : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                    }`}
                  >
                    View All →
                  </button>
                </div>
                <div className="flex flex-1 flex-wrap items-center justify-end sm:ml-auto">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md"
                  >
                    <SearchIcon className="h-4 w-4 shrink-0 text-white" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
