"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { sendOtpEmail } from "@/lib/email";
import { generateOtpCode, hashOtpCode } from "@/lib/otp";
import { safeStringEqual } from "@/lib/crypto-util";
import { signUserToken } from "@/lib/auth";
import { User } from "@/models/User";
import { EmailOtp } from "@/models/EmailOtp";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(6).max(120),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export type UserAuthState = { error?: string; success?: boolean };

export async function registerUser(
  _prev: UserAuthState | undefined,
  formData: FormData
): Promise<UserAuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter valid registration details." };

  await connectToDatabase();
  const email = parsed.data.email.toLowerCase();
  const existing = await User.findOne({ email }).lean();
  if (existing?.isEmailVerified) return { error: "Email already registered." };

  const passwordHash = await hashPassword(parsed.data.password);
  if (!existing) {
    await User.create({
      name: parsed.data.name,
      email,
      passwordHash,
      isEmailVerified: false,
    });
  } else {
    await User.updateOne(
      { _id: existing._id },
      {
        $set: {
          name: parsed.data.name,
          passwordHash,
          isEmailVerified: false,
        },
      }
    );
  }

  const code = generateOtpCode();
  await EmailOtp.deleteMany({ email, purpose: "verify_account" });
  await EmailOtp.create({
    email,
    purpose: "verify_account",
    codeHash: hashOtpCode(code),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  const sent = await sendOtpEmail(email, code, "Verify your ClassAds account");
  if (!sent) return { error: "Could not send OTP email. Check SMTP settings." };
  return { success: true };
}

export async function verifyRegistrationOtp(
  _prev: UserAuthState | undefined,
  formData: FormData
): Promise<UserAuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const otp = String(formData.get("otp") ?? "").trim();
  if (!email || !otp) return { error: "Email and OTP are required." };

  await connectToDatabase();
  const otpDoc = await EmailOtp.findOne({ email, purpose: "verify_account" })
    .sort({ createdAt: -1 })
    .lean();
  if (!otpDoc) return { error: "OTP not found." };
  if (new Date(otpDoc.expiresAt).getTime() < Date.now()) {
    return { error: "OTP expired." };
  }
  const ok = safeStringEqual(hashOtpCode(otp), String(otpDoc.codeHash ?? ""));
  if (!ok) return { error: "Invalid OTP." };

  const user = await User.findOneAndUpdate(
    { email },
    { isEmailVerified: true },
    { new: true }
  ).lean();
  if (!user) return { error: "User not found." };

  const token = await signUserToken(String(user._id), email);
  const store = await cookies();
  store.set("user_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return { success: true };
}

export async function loginUser(
  _prev: UserAuthState | undefined,
  formData: FormData
): Promise<UserAuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter valid email and password." };

  await connectToDatabase();
  const email = parsed.data.email.toLowerCase();
  const user = await User.findOne({ email }).lean();
  if (!user) return { error: "Invalid email or password." };

  const okPass = await verifyPassword(String(user.passwordHash ?? ""), parsed.data.password);
  if (!okPass) return { error: "Invalid email or password." };
  if (!user.isEmailVerified) return { error: "Verify your email OTP before login." };

  const token = await signUserToken(String(user._id), email);
  const store = await cookies();
  store.set("user_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return { success: true };
}

export async function logoutUser() {
  const store = await cookies();
  store.delete("user_token");
  redirect("/");
}
