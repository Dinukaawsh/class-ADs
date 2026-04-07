"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createAd, type CreateAdState } from "@/app/actions/ads";
import { SUBJECTS, GRADES, DISTRICTS, CLASS_TYPES } from "@/lib/constants";

const initial: CreateAdState = {};

export function SubmitForm() {
  const [state, formAction, pending] = useActionState(createAd, initial);

  if (state.success) {
    return (
      <div className="animate-fade-in rounded-2xl border border-success/30 bg-success/5 px-6 py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">
          Ad Submitted Successfully!
        </h2>
        <p className="mt-2 text-sm text-muted">
          Your class advertisement has been submitted for review. It will be visible to students once approved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Back to Home
          </Link>
          <Link
            href="/submit"
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-alt"
          >
            Post Another Ad
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction}>
      {state.error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {state.error}
        </div>
      )}

      <div className="space-y-8">
        <FormSection title="Class Information" step={1}>
          <Field label="Class Title" required>
            <input
              name="title"
              required
              maxLength={200}
              disabled={pending}
              placeholder="e.g. A/L Physics 2027 — Theory & Paper Classes"
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Subject" required>
              <select name="subject" required disabled={pending} className={inputClass}>
                <option value="">Select Subject</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Grade Level" required>
              <select name="grade" required disabled={pending} className={inputClass}>
                <option value="">Select Grade</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Class Type">
              <select name="classType" disabled={pending} className={inputClass}>
                {CLASS_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Fee (optional)">
              <input
                name="price"
                maxLength={100}
                disabled={pending}
                placeholder="e.g. 2,500 per month"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Description" required>
            <textarea
              name="body"
              required
              rows={5}
              maxLength={8000}
              disabled={pending}
              placeholder="Describe your class — what you teach, schedule, syllabus coverage, etc."
              className={inputClass}
            />
          </Field>
        </FormSection>

        <FormSection title="Location" step={2}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="District" required>
              <select name="district" required disabled={pending} className={inputClass}>
                <option value="">Select District</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>
            <Field label="City (optional)">
              <input
                name="city"
                maxLength={100}
                disabled={pending}
                placeholder="e.g. Nugegoda"
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Tutor Details" step={3}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your Name" required>
              <input
                name="tutorName"
                required
                maxLength={200}
                disabled={pending}
                placeholder="e.g. Mr. Kamal Perera"
                className={inputClass}
              />
            </Field>
            <Field label="Qualification (optional)">
              <input
                name="tutorQualification"
                maxLength={500}
                disabled={pending}
                placeholder="e.g. B.Sc. (Hons) Physics, PGDE"
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Contact Information" step={4}>
          <p className="text-xs text-muted">
            Provide at least one contact method so students can reach you.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone Number">
              <input
                name="phone"
                type="tel"
                maxLength={20}
                disabled={pending}
                placeholder="e.g. 071 234 5678"
                className={inputClass}
              />
            </Field>
            <Field label="WhatsApp Number">
              <input
                name="whatsapp"
                type="tel"
                maxLength={20}
                disabled={pending}
                placeholder="e.g. +94712345678"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Email (optional)">
            <input
              name="email"
              type="email"
              maxLength={200}
              disabled={pending}
              placeholder="e.g. tutor@email.com"
              className={inputClass}
            />
          </Field>
        </FormSection>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-8 w-full rounded-xl bg-primary px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-primary-dark hover:shadow-xl disabled:opacity-50 active:scale-[0.99]"
      >
        {pending ? "Submitting..." : "Submit Your Class Ad"}
      </button>

      <p className="mt-3 text-center text-xs text-muted">
        Your ad will be reviewed by our team before publishing.
      </p>
    </form>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50 dark:bg-surface";

function FormSection({
  title,
  step,
  children,
}: {
  title: string;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-border bg-white p-6 shadow-sm dark:bg-surface">
      <legend className="flex items-center gap-2 px-2 text-sm font-bold text-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {step}
        </span>
        {title}
      </legend>
      <div className="mt-4 space-y-4">{children}</div>
    </fieldset>
  );
}

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
