"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SUBJECTS, GRADES, DISTRICTS, CLASS_TYPES } from "@/lib/constants";

type FilterValues = {
  listingType: "tutor" | "institute";
  q: string;
  subject: string;
  grade: string;
  district: string;
  classType: string;
};

export function SearchFilters({ current }: { current: FilterValues }) {
  const router = useRouter();
  const [q, setQ] = useState(current.q);
  const [listingType, setListingType] = useState(current.listingType);
  const [subject, setSubject] = useState(current.subject);
  const [grade, setGrade] = useState(current.grade);
  const [district, setDistrict] = useState(current.district);
  const [classType, setClassType] = useState(current.classType);

  function applyFilters() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (subject) params.set("subject", subject);
    if (grade && listingType === "tutor") params.set("grade", grade);
    if (district) params.set("district", district);
    if (classType && listingType === "tutor") params.set("classType", classType);
    if (listingType === "institute") {
      router.push(`/institutes?${params.toString()}`);
      return;
    }
    router.push(`/search?${params.toString()}`);
  }

  function clearFilters() {
    setQ("");
    setListingType("tutor");
    setSubject("");
    setGrade("");
    setDistrict("");
    setClassType("");
    router.push("/search");
  }

  const selectClass =
    "w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground";

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wide text-muted">
        Filters
      </h3>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-foreground">
            Search
          </label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Keyword, tutor..."
            className={selectClass}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-foreground">
            Listing Type
          </label>
          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value as "tutor" | "institute")}
            className={selectClass}
          >
            <option value="tutor">Individual Tutor</option>
            <option value="institute">Institute</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-foreground">
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={selectClass}
          >
            <option value="">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {listingType === "tutor" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">
              Grade Level
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className={selectClass}
            >
              <option value="">All Grades</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-foreground">
            District
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className={selectClass}
          >
            <option value="">All Districts</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {listingType === "tutor" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">
              Class Type
            </label>
            <select
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              className={selectClass}
            >
              <option value="">All Types</option>
              {CLASS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={applyFilters}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-alt"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
