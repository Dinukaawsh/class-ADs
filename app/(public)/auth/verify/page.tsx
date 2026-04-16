"use client";

import { useActionState } from "react";
import { verifyRegistrationOtp, type UserAuthState } from "@/app/actions/user-auth";
import { Toast } from "@/components/ui/toast";

const initial: UserAuthState = {};

export default function VerifyOtpPage() {
  const [state, formAction, pending] = useActionState(verifyRegistrationOtp, initial);

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <Toast
        message={state.error ?? (state.success ? "OTP verified." : undefined)}
        type={state.error ? "error" : "success"}
      />
      <h1 className="text-2xl font-bold text-foreground">Verify Email OTP</h1>
      <form action={formAction} className="mt-6 space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
        {state.error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p> : null}
        {state.success ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">Verified successfully. You can now post ads.</p> : null}
        <div>
          <label className="text-sm font-medium text-foreground">Email</label>
          <input name="email" type="email" required className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">OTP Code</label>
          <input name="otp" required className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={pending} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white">
          {pending ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}
