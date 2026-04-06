"use server";

import { redirect } from "next/navigation";

import { env } from "@/lib/env";
import { setAdminSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const emailOk = email === env.ADMIN_EMAIL.toLowerCase();
  const passwordOk = password === env.ADMIN_PASSWORD;

  if (!emailOk || !passwordOk) {
    redirect("/login?error=Invalid%20credentials");
  }

  await setAdminSession();
  redirect("/admin");
}
