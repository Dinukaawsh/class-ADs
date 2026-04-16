"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { signAdminToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { AdminUser } from "@/models/AdminUser";

const loginSchema = z.object({
  email: z.string().trim().optional(),
  password: z.string().min(1).optional(),
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
    return { error: "Enter valid login details." };
  }

  const isDevelopmentMode = process.env.NODE_ENV !== "production";
  const devAuthEnabled = process.env.DEV_ADMIN_AUTH === "true";
  if (isDevelopmentMode && devAuthEnabled) {
    const envAdminEmail = process.env.DEV_ADMIN_EMAIL?.trim().toLowerCase();
    const envAdminPassword = process.env.DEV_ADMIN_PASSWORD;
    if (!envAdminEmail || !envAdminPassword) {
      return { error: "Missing DEV_ADMIN_EMAIL or DEV_ADMIN_PASSWORD in env." };
    }
    if (!parsed.data.email || !parsed.data.password) {
      return { error: "Enter a valid email and password." };
    }
    const okEmail = parsed.data.email.trim().toLowerCase() === envAdminEmail;
    const okPassword = parsed.data.password === envAdminPassword;
    if (!okEmail || !okPassword) {
      return { error: "Invalid email or password." };
    }
    const token = await signAdminToken(envAdminEmail);
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

  if (!parsed.data.email || !parsed.data.password) {
    return { error: "Enter a valid email and password." };
  }

  await connectToDatabase();
  const email = parsed.data.email.trim().toLowerCase();
  const admin = await AdminUser.findOne({ email, isActive: true }).lean();
  if (!admin) {
    return { error: "Invalid email or password." };
  }

  const okPass = await verifyPassword(
    String(admin.passwordHash ?? ""),
    parsed.data.password
  );
  if (!okPass) {
    return { error: "Invalid email or password." };
  }
  const token = await signAdminToken(email);
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
