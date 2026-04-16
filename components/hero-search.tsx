"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SUBJECTS, GRADES, DISTRICTS } from "@/lib/constants";
import { Dropdown } from "@/components/ui/dropdown";
import { AnimatedOrbs } from "@/components/hero/animated-orbs";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [district, setDistrict] = useState("");

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
    <section className="relative z-20 overflow-x-hidden overflow-y-visible bg-gradient-to-b from-slate-50 via-blue-50/60 to-white px-4 py-16 text-foreground sm:py-24">
      <AnimatedOrbs />
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Find the Best Tuition Classes
          <span className="mt-2 block bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            in Sri Lanka
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-medium text-muted sm:text-2xl">
          Search thousands of tuition classes by subject, grade, or location.
          Connect with qualified tutors instantly.
        </p>

        <form
          onSubmit={handleSearch}
          className="relative z-30 mx-auto mt-8 max-w-3xl rounded-2xl border border-border bg-white p-2 shadow-xl sm:p-3"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Search by keyword, subject, or tutor..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-white px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              className="rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-accent/90 active:scale-[0.98] sm:shrink-0"
            >
              Search
            </button>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Dropdown
              value={subject}
              onChange={setSubject}
              placeholder="All Subjects"
              className="text-left"
              options={SUBJECTS.map((s) => ({ label: s, value: s }))}
            />
            <Dropdown
              value={grade}
              onChange={setGrade}
              placeholder="All Grades"
              className="text-left"
              options={GRADES.map((g) => ({ label: g, value: g }))}
            />
            <Dropdown
              value={district}
              onChange={setDistrict}
              placeholder="All Districts"
              className="text-left"
              options={DISTRICTS.map((d) => ({ label: d, value: d }))}
            />
          </div>
        </form>
      </div>
    </section>
  );
}
