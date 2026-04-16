"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { signAdminToken } from "@/lib/auth";
import { safeStringEqual } from "@/lib/crypto-util";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginState = { error?: string };

export async function loginAdmin(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return { error: "Server is not configured for admin login." };
  }
  const okEmail = safeStringEqual(
    parsed.data.email.trim().toLowerCase(),
    adminEmail.trim().toLowerCase()
  );
  const okPass = safeStringEqual(parsed.data.password, adminPassword);
  if (!okEmail || !okPass) {
    return { error: "Invalid email or password." };
  }
  const token = await signAdminToken(parsed.data.email);
  const store = await cookies();
  store.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete("admin_token");
  redirect("/admin/login");
}
