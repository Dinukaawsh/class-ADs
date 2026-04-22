"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SUBJECTS, GRADES, DISTRICTS, CLASS_TYPES } from "@/lib/constants";
import { Dropdown } from "@/components/ui/dropdown";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const inputClass =
    "w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground";

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wide text-muted">
        Filters
      </h3>

      <ScrollArea className="mt-4 max-h-[70vh] pr-1">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-foreground">
            Search
          </label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Keyword, tutor..."
            className={inputClass}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-foreground">
            Listing Type
          </label>
          <Dropdown
            value={listingType}
            onChange={(value) => setListingType(value as "tutor" | "institute")}
            placeholder="Select Listing Type"
            options={[
              { label: "Individual Tutor", value: "tutor" },
              { label: "Institute", value: "institute" },
            ]}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-foreground">
            Subject
          </label>
          <Dropdown
            value={subject}
            onChange={setSubject}
            placeholder="All Subjects"
            options={SUBJECTS.map((s) => ({ label: s, value: s }))}
          />
        </div>

        {listingType === "tutor" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">
              Grade Level
            </label>
            <Dropdown
              value={grade}
              onChange={setGrade}
              placeholder="All Grades"
              options={GRADES.map((g) => ({ label: g, value: g }))}
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-foreground">
            District
          </label>
          <Dropdown
            value={district}
            onChange={setDistrict}
            placeholder="All Districts"
            options={DISTRICTS.map((d) => ({ label: d, value: d }))}
          />
        </div>

        {listingType === "tutor" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">
              Class Type
            </label>
            <Dropdown
              value={classType}
              onChange={setClassType}
              placeholder="All Types"
              options={CLASS_TYPES.map((t) => ({ label: t, value: t }))}
            />
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
      </ScrollArea>
    </div>
  );
}

export function SearchFiltersHorizontal({
  current,
  showOnScroll = false,
}: {
  current: FilterValues;
  showOnScroll?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(current.q);
  const [subject, setSubject] = useState(current.subject);
  const [grade, setGrade] = useState(current.grade);
  const [district, setDistrict] = useState(current.district);
  const [showStickyFilters, setShowStickyFilters] = useState(false);

  useEffect(() => {
    if (!showOnScroll) return;
    const onScroll = () => setShowStickyFilters(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showOnScroll]);

  function applyFilters() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (subject) params.set("subject", subject);
    if (grade) params.set("grade", grade);
    if (district) params.set("district", district);
    router.push(`/search?${params.toString()}`);
  }

  const filterContent = (
    <div className="bg-white p-3">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto] lg:items-center">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Keyword, subject, or tutor..."
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground"
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        />
        <Dropdown
          value={subject}
          onChange={setSubject}
          placeholder="All subjects"
          options={SUBJECTS.map((s) => ({ label: s, value: s }))}
        />
        <Dropdown
          value={grade}
          onChange={setGrade}
          placeholder="All grades"
          options={GRADES.map((g) => ({ label: g, value: g }))}
        />
        <Dropdown
          value={district}
          onChange={setDistrict}
          placeholder="All districts"
          options={DISTRICTS.map((d) => ({ label: d, value: d }))}
        />
        <button
          onClick={applyFilters}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Search
        </button>
      </div>
    </div>
  );

  if (!showOnScroll) return filterContent;

  return (
    <>
      {filterContent}
      <div
        className={`fixed inset-x-0 top-16 z-40 border-b border-border bg-white transition-all duration-200 ${
          showStickyFilters ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-2 py-2 sm:px-4 lg:px-6">
          {filterContent}
        </div>
      </div>
    </>
  );
}
