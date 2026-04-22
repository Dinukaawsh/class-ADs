"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SUBJECTS, GRADES, DISTRICTS } from "@/lib/constants";
import { Dropdown } from "@/components/ui/dropdown";
import { AnimatedOrbs } from "@/components/hero/animated-orbs";
import FloatingLines from "@/components/FloatingLines";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [district, setDistrict] = useState("");
  const [showStickyFilters, setShowStickyFilters] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyFilters(window.scrollY > 10);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <>
      <div
        className={`fixed inset-x-0 top-16 z-40 border-b border-border bg-white transition-all duration-200 ${
          showStickyFilters ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto grid max-w-7xl gap-2 px-3 py-2 sm:grid-cols-2 sm:px-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto] lg:items-center">
          <input
            type="text"
            placeholder="Keyword, subject, or tutor..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/30 lg:col-span-1"
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
            type="button"
            onClick={() => {
              const params = new URLSearchParams();
              if (query) params.set("q", query);
              if (subject) params.set("subject", subject);
              if (grade) params.set("grade", grade);
              if (district) params.set("district", district);
              router.push(`/search?${params.toString()}`);
            }}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary-dark"
          >
            Search
          </button>
        </div>
      </div>

      <section className="relative z-20 overflow-x-hidden overflow-y-visible bg-white px-4 py-16 text-foreground sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-45">
        <FloatingLines
          linesGradient={["#f7fbff", "#8cb5dd", "#1f5faa", "#062f63"]}
          topWavePosition={{ x: 10, y: 0.5, rotate: -0.4 }}
          middleWavePosition={{ x: 5, y: 0, rotate: 0.2 }}
          interactive={false}
          parallax={false}
          mixBlendMode="normal"
        />
      </div>
      <AnimatedOrbs />
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Find the Best Tuition Classes
          <span className="mt-2 block bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
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
              className="rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-primary-dark active:scale-[0.98] sm:shrink-0"
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
    </>
  );
}
