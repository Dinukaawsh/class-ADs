"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createInstitute, type CreateInstituteState } from "@/app/actions/institutes";
import { DISTRICTS, SUBJECTS } from "@/lib/constants";

const initial: CreateInstituteState = {};

export function InstituteForm() {
  const [state, formAction, pending] = useActionState(createInstitute, initial);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 px-6 py-10 text-center">
        <h2 className="text-xl font-bold text-foreground">Institute Profile Published</h2>
        <p className="mt-2 text-sm text-muted">
          Your institute profile is now live in the Institutes marketplace.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/institutes"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse Institutes
          </Link>
          <Link
            href="/institutes/dashboard"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <fieldset className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <legend className="px-2 text-sm font-bold text-foreground">Institute Basics</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Institute Name" required>
            <input name="name" required maxLength={180} className={inputClass} disabled={pending} />
          </Field>
          <Field label="Logo URL">
            <input name="logoUrl" maxLength={500} className={inputClass} disabled={pending} />
          </Field>
          <Field label="District" required>
            <select name="district" required className={inputClass} disabled={pending}>
              <option value="">Select District</option>
              {DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </Field>
          <Field label="City">
            <input name="city" maxLength={120} className={inputClass} disabled={pending} />
          </Field>
          <Field label="Subjects / Course Categories" required>
            <input
              name="subjects"
              required
              className={inputClass}
              placeholder="Comma separated (e.g. Mathematics, ICT, English)"
              disabled={pending}
              list="subjects-list"
            />
            <datalist id="subjects-list">
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject} />
              ))}
            </datalist>
          </Field>
          <Field label="Class Modes">
            <input
              name="classModes"
              className={inputClass}
              placeholder="Comma separated (Online, Physical, Hybrid)"
              defaultValue="Physical, Online"
              disabled={pending}
            />
          </Field>
        </div>

        <Field label="Institute Overview / Description" required>
          <textarea
            name="description"
            required
            rows={5}
            maxLength={5000}
            className={inputClass}
            disabled={pending}
          />
        </Field>
      </fieldset>

      <fieldset className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <legend className="px-2 text-sm font-bold text-foreground">Courses & Team</legend>
        <div className="space-y-4">
          <Field label="Courses (one per line)">
            <textarea
              name="courses"
              rows={5}
              maxLength={3000}
              className={inputClass}
              placeholder="A/L Physics 2027 - Weekend Batch"
              disabled={pending}
            />
          </Field>
          <Field label="Tutors / Lecturers (one per line)">
            <textarea
              name="lecturers"
              rows={4}
              maxLength={2000}
              className={inputClass}
              placeholder="Mr. Kamal Perera - BSc (Hons) Physics"
              disabled={pending}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Grades Taught">
              <input
                name="grades"
                className={inputClass}
                placeholder="Grade 6-9, O/L, A/L"
                disabled={pending}
              />
            </Field>
            <Field label="Schedules">
              <input
                name="schedules"
                className={inputClass}
                placeholder="Weekdays 6PM-8PM, Weekends 9AM-1PM"
                disabled={pending}
              />
            </Field>
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <legend className="px-2 text-sm font-bold text-foreground">Contact & Branding</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone">
            <input name="phone" type="tel" className={inputClass} disabled={pending} />
          </Field>
          <Field label="WhatsApp">
            <input name="whatsapp" type="tel" className={inputClass} disabled={pending} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" className={inputClass} disabled={pending} />
          </Field>
          <Field label="Website">
            <input name="website" className={inputClass} placeholder="https://example.com" disabled={pending} />
          </Field>
        </div>
        <div className="mt-4 space-y-4">
          <Field label="Facilities">
            <input
              name="facilities"
              className={inputClass}
              placeholder="AC Classrooms, Library, Smart Boards"
              disabled={pending}
            />
          </Field>
          <Field label="Gallery Image URLs">
            <textarea
              name="galleryImages"
              rows={3}
              className={inputClass}
              placeholder="Comma separated image URLs"
              disabled={pending}
            />
          </Field>
          <label className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <input type="checkbox" name="isFeatured" className="h-4 w-4 rounded border-border" />
            Mark as featured institute
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
      >
        {pending ? "Publishing..." : "Publish Institute Profile"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/10";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
