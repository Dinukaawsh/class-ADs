"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createInstitute, type CreateInstituteState } from "@/app/actions/institutes";
import { CLASS_TYPES, DISTRICTS, SUBJECTS } from "@/lib/constants";
import { Dropdown } from "@/components/ui/dropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toast } from "@/components/ui/toast";

const initial: CreateInstituteState = {};

export function InstituteForm({
  inModal = false,
  onClose,
}: {
  inModal?: boolean;
  onClose?: () => void;
}) {
  const [state, formAction, pending] = useActionState(createInstitute, initial);
  const [district, setDistrict] = useState("");
  const [subjectCategory, setSubjectCategory] = useState("");
  const [classMode, setClassMode] = useState<string>(CLASS_TYPES[1] ?? "Physical");

  if (state.success) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 px-6 py-10 text-center">
        <h2 className="text-xl font-bold text-foreground">Institute Profile Published</h2>
        <p className="mt-2 text-sm text-muted">
          Your institute profile is now live in the Institutes marketplace.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link href="/institutes" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">Browse Institutes</Link>
          <Link href="/account/ads" className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground">Go to My Account</Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <Toast
      message={state.error ?? (state.success ? "Institute profile published." : undefined)}
      type={state.error ? "error" : "success"}
    />
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      )}
      <ScrollArea className="max-h-[75vh] pr-1">
      <div className="space-y-8">
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
            <Dropdown name="district" required disabled={pending} value={district} onChange={setDistrict} placeholder="Select District" options={DISTRICTS.map((item) => ({ label: item, value: item }))} />
          </Field>
          <Field label="City">
            <input name="city" maxLength={120} className={inputClass} disabled={pending} />
          </Field>
          <Field label="Subjects / Course Categories" required>
            <Dropdown name="subjects" required disabled={pending} value={subjectCategory} onChange={setSubjectCategory} placeholder="Select Subject Category" options={SUBJECTS.map((subject) => ({ label: subject, value: subject }))} />
          </Field>
          <Field label="Class Modes">
            <Dropdown
              name="classModes"
              disabled={pending}
              value={classMode}
              onChange={setClassMode}
              placeholder="Select Class Mode"
              options={CLASS_TYPES.map((mode) => ({ label: mode, value: mode }))}
            />
          </Field>
        </div>
        <Field label="Institute Overview / Description" required>
          <textarea name="description" required rows={5} maxLength={5000} className={inputClass} disabled={pending} />
        </Field>
      </fieldset>

      <fieldset className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <legend className="px-2 text-sm font-bold text-foreground">Courses & Team</legend>
        <div className="space-y-4">
          <Field label="Courses (one per line)">
            <textarea name="courses" rows={5} maxLength={3000} className={inputClass} placeholder="A/L Physics 2027 - Weekend Batch" disabled={pending} />
          </Field>
          <Field label="Tutors / Lecturers (one per line)">
            <textarea name="lecturers" rows={4} maxLength={2000} className={inputClass} placeholder="Mr. Kamal Perera - BSc (Hons) Physics" disabled={pending} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Grades Taught">
              <input name="grades" className={inputClass} placeholder="Grade 6-9, O/L, A/L" disabled={pending} />
            </Field>
            <Field label="Schedules">
              <input name="schedules" className={inputClass} placeholder="Weekdays 6PM-8PM, Weekends 9AM-1PM" disabled={pending} />
            </Field>
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <legend className="px-2 text-sm font-bold text-foreground">Contact & Branding</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone"><input name="phone" type="tel" className={inputClass} disabled={pending} /></Field>
          <Field label="WhatsApp"><input name="whatsapp" type="tel" className={inputClass} disabled={pending} /></Field>
          <Field label="Email"><input name="email" type="email" className={inputClass} disabled={pending} /></Field>
          <Field label="Website"><input name="website" className={inputClass} placeholder="https://example.com" disabled={pending} /></Field>
        </div>
        <div className="mt-4 space-y-4">
          <Field label="Facilities"><input name="facilities" className={inputClass} placeholder="AC Classrooms, Library, Smart Boards" disabled={pending} /></Field>
          <Field label="Gallery Image URLs"><textarea name="galleryImages" rows={3} className={inputClass} placeholder="Comma separated image URLs" disabled={pending} /></Field>
          <label className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <input type="checkbox" name="isFeatured" className="h-4 w-4 rounded border-border" />
            Mark as featured institute
          </label>
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {inModal ? (
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-surface-alt"
          >
            Close
          </button>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className={`w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-50 ${inModal ? "" : "sm:col-span-2"}`}
        >
          {pending ? "Publishing..." : "Publish Institute Profile"}
        </button>
      </div>
      </div>
      </ScrollArea>
    </form>
    </>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/10";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
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
