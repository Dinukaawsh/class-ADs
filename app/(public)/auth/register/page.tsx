"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerUser, type UserAuthState } from "@/app/actions/user-auth";
import { Toast } from "@/components/ui/toast";

const initial: UserAuthState = {};

export default function UserRegisterPage() {
  const [state, formAction, pending] = useActionState(registerUser, initial);

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <Toast
        message={state.error ?? (state.success ? "OTP sent to your email." : undefined)}
        type={state.error ? "error" : "success"}
      />
      <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
      <form action={formAction} className="mt-6 space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
        {state.error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p> : null}
        {state.success ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">OTP sent to your email. Verify below.</p> : null}
        <div>
          <label className="text-sm font-medium text-foreground">Name</label>
          <input name="name" required className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Email</label>
          <input name="email" type="email" required className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Password</label>
          <input name="password" type="password" required className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={pending} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white">
          {pending ? "Creating..." : "Register"}
        </button>
      </form>
      <p className="mt-4 text-sm text-muted">
        Already registered? <Link href="/auth/verify" className="font-semibold text-primary">Verify OTP</Link>
      </p>
    </div>
  );
}
