"use client";

import Link from "next/link";
import Script from "next/script";
import { useActionState, useEffect, useRef, useState } from "react";
import { createAd, type CreateAdState } from "@/app/actions/ads";
import { SUBJECTS, GRADES, DISTRICTS, CLASS_TYPES } from "@/lib/constants";
import { Dropdown } from "@/components/ui/dropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toast } from "@/components/ui/toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const initial: CreateAdState = {};

type SubmitFormValues = {
  title: string;
  subject: string;
  grade: string;
  classType: string;
  bannerType: "premium" | "normal";
  price: string;
  body: string;
  district: string;
  city: string;
  mapLocationUrl: string;
  tutorName: string;
  tutorQualification: string;
  phone: string;
  whatsapp: string;
  email: string;
};

type TurnstileInstance = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    }
  ) => string;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
  }
}

export function SubmitForm() {
  const [state, formAction, pending] = useActionState(createAd, initial);
  const [values, setValues] = useState<SubmitFormValues>({
    title: "",
    subject: "",
    grade: "",
    classType: CLASS_TYPES[0] ?? "Online",
    bannerType: "normal",
    price: "",
    body: "",
    district: "",
    city: "",
    mapLocationUrl: "",
    tutorName: "",
    tutorQualification: "",
    phone: "",
    whatsapp: "",
    email: "",
  });
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const enforceTurnstile = process.env.NODE_ENV === "production";
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const mountedRef = useRef(false);
  const pendingStateCallbacksRef = useRef<Array<() => void>>([]);
  const [turnstileScriptLoaded, setTurnstileScriptLoaded] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    if (pendingStateCallbacksRef.current.length > 0) {
      const queued = [...pendingStateCallbacksRef.current];
      pendingStateCallbacksRef.current = [];
      queued.forEach((fn) => fn());
    }
    return () => {
      mountedRef.current = false;
      pendingStateCallbacksRef.current = [];
    };
  }, []);

  /** Prevent setState calls before mount for script/widget callbacks. */
  function scheduleSafeStateUpdate(fn: () => void) {
    queueMicrotask(() => {
      if (mountedRef.current) {
        fn();
        return;
      }
      pendingStateCallbacksRef.current.push(fn);
    });
  }

  useEffect(() => {
    if (!enforceTurnstile) return;
    if (!turnstileSiteKey) return;
    if (!turnstileScriptLoaded) return;
    if (!turnstileContainerRef.current) return;
    if (turnstileWidgetIdRef.current) return;

    let attempts = 0;
    const maxAttempts = 20;

    const intervalId = window.setInterval(() => {
      attempts += 1;
      const turnstile = window.turnstile;
      if (!turnstile) {
        if (attempts >= maxAttempts) {
          scheduleSafeStateUpdate(() =>
            setTurnstileError(
              "Cloudflare verification could not load. Disable ad blocker/shield and refresh."
            )
          );
          window.clearInterval(intervalId);
        }
        return;
      }

      try {
        turnstileWidgetIdRef.current = turnstile.render(turnstileContainerRef.current!, {
          sitekey: turnstileSiteKey,
          theme: "light",
          callback: (token) => {
            scheduleSafeStateUpdate(() => {
              setTurnstileToken(token);
              setTurnstileError(null);
            });
          },
          "expired-callback": () => scheduleSafeStateUpdate(() => setTurnstileToken("")),
          "error-callback": () => {
            scheduleSafeStateUpdate(() => {
              setTurnstileToken("");
              setTurnstileError(
                "Verification failed to render. Refresh page and check Turnstile site key domain settings."
              );
            });
          },
        });
        scheduleSafeStateUpdate(() => setTurnstileError(null));
        window.clearInterval(intervalId);
      } catch {
        if (attempts >= maxAttempts) {
          scheduleSafeStateUpdate(() =>
            setTurnstileError(
              "Could not render verification widget. Check Turnstile key/domain and refresh."
            )
          );
          window.clearInterval(intervalId);
        }
      }
    }, 150);

    return () => window.clearInterval(intervalId);
  }, [enforceTurnstile, turnstileScriptLoaded, turnstileSiteKey]);

  useEffect(() => {
    if (!state.error) return;
    if (!window.turnstile || !turnstileWidgetIdRef.current) return;
    window.turnstile.reset(turnstileWidgetIdRef.current);
  }, [state.error]);

  const effectiveTurnstileToken = state.error ? "" : turnstileToken;

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
    <>
    <Toast
      message={state.error ?? (state.success ? "Ad submitted successfully." : undefined)}
      type={state.error ? "error" : "success"}
    />
    <form action={formAction}>
      {state.error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <ScrollArea className="max-h-[75vh] pr-1">
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
              value={values.title}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, title: event.target.value }))
              }
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Subject" required>
              <Dropdown
                name="subject"
                required
                disabled={pending}
                value={values.subject}
                onChange={(value) => setValues((prev) => ({ ...prev, subject: value }))}
                placeholder="Select Subject"
                options={SUBJECTS.map((s) => ({ label: s, value: s }))}
              />
            </Field>
            <Field label="Grade Level" required>
              <Dropdown
                name="grade"
                required
                disabled={pending}
                value={values.grade}
                onChange={(value) => setValues((prev) => ({ ...prev, grade: value }))}
                placeholder="Select Grade"
                options={GRADES.map((g) => ({ label: g, value: g }))}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Class Type">
              <Dropdown
                name="classType"
                disabled={pending}
                value={values.classType}
                onChange={(value) =>
                  setValues((prev) => ({ ...prev, classType: value }))
                }
                placeholder="All Types"
                options={CLASS_TYPES.map((t) => ({ label: t, value: t }))}
              />
            </Field>
            <Field label="Banner Type" required>
              <Dropdown
                name="bannerType"
                required
                disabled={pending}
                value={values.bannerType}
                onChange={(value) =>
                  setValues((prev) => ({
                    ...prev,
                    bannerType: value as "premium" | "normal",
                  }))
                }
                placeholder="Select Banner Type"
                options={[
                  { label: "Normal Banner", value: "normal" },
                  { label: "Premium Banner", value: "premium" },
                ]}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fee (optional)">
              <input
                name="price"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={100}
                disabled={pending}
                placeholder="e.g. 2500"
                className={inputClass}
                value={values.price}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    price: event.target.value.replace(/\D/g, ""),
                  }))
                }
              />
            </Field>
          </div>

          <Field label="Class Image (PNG/WEBP, optional)">
            <input
              name="imageFile"
              type="file"
              accept="image/png,image/webp,.png,.webp"
              disabled={pending}
              className={inputClass}
            />
          </Field>

          <Field label="Description" required>
            <textarea
              name="body"
              required
              rows={5}
              maxLength={8000}
              disabled={pending}
              placeholder="Describe your class — what you teach, schedule, syllabus coverage, etc."
              className={inputClass}
              value={values.body}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, body: event.target.value }))
              }
            />
          </Field>
        </FormSection>

        <FormSection title="Location" step={2}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="District" required>
              <Dropdown
                name="district"
                required
                disabled={pending}
                value={values.district}
                onChange={(value) =>
                  setValues((prev) => ({ ...prev, district: value }))
                }
                placeholder="Select District"
                options={DISTRICTS.map((d) => ({ label: d, value: d }))}
              />
            </Field>
            <Field label="City (optional)">
              <input
                name="city"
                maxLength={100}
                disabled={pending}
                placeholder="e.g. Nugegoda"
                className={inputClass}
                value={values.city}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, city: event.target.value }))
                }
              />
            </Field>
          </div>
          <Field label="Google Maps URL (optional)">
            <input
              name="mapLocationUrl"
              type="url"
              maxLength={1200}
              disabled={pending}
              placeholder="https://maps.google.com/?q=..."
              className={inputClass}
              value={values.mapLocationUrl}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, mapLocationUrl: event.target.value }))
              }
            />
          </Field>
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
                value={values.tutorName}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, tutorName: event.target.value }))
                }
              />
            </Field>
            <Field label="Qualification (optional)">
              <input
                name="tutorQualification"
                maxLength={500}
                disabled={pending}
                placeholder="e.g. B.Sc. (Hons) Physics, PGDE"
                className={inputClass}
                value={values.tutorQualification}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    tutorQualification: event.target.value,
                  }))
                }
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
                value={values.phone}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, phone: event.target.value }))
                }
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
                value={values.whatsapp}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, whatsapp: event.target.value }))
                }
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
              value={values.email}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </Field>
        </FormSection>

        <FormSection title="Human Verification" step={5}>
          {!enforceTurnstile ? (
            <p className="text-sm text-muted">
              Verification is disabled in development mode and enabled automatically in production.
            </p>
          ) : !turnstileSiteKey ? (
            <p className="text-sm text-red-600">
              Turnstile is not configured. Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
            </p>
          ) : (
            <>
              <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                strategy="afterInteractive"
                onLoad={() => scheduleSafeStateUpdate(() => setTurnstileScriptLoaded(true))}
                onError={() =>
                  scheduleSafeStateUpdate(() =>
                    setTurnstileError(
                      "Failed to load verification script. Check internet or browser extension blocking."
                    )
                  )
                }
              />
              <div ref={turnstileContainerRef} className="min-h-[65px]" />
              <input
                type="hidden"
                name="cf-turnstile-response"
                value={effectiveTurnstileToken}
                readOnly
              />
              {turnstileError ? (
                <p className="text-xs text-red-600">{turnstileError}</p>
              ) : null}
              {!effectiveTurnstileToken ? (
                <p className="text-xs text-muted">
                  Complete the verification before submitting.
                </p>
              ) : null}
            </>
          )}
        </FormSection>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-primary-dark hover:shadow-xl disabled:opacity-50 active:scale-[0.99]"
      >
        {pending ? (
          <>
            <LoadingSpinner size={18} />
            Submitting...
          </>
        ) : (
          "Submit Your Class Ad"
        )}
      </button>

      <p className="mt-3 text-center text-xs text-muted">
        Your ad will be reviewed by our team before publishing.
      </p>
      </ScrollArea>
    </form>
    </>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50";

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
    <fieldset className="rounded-2xl border border-border bg-white p-6 shadow-sm">
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
