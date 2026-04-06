import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

const COOKIE_NAME = "classads_admin_session";
const encoder = new TextEncoder();

type SessionPayload = {
  email: string;
  role: "admin";
};

async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(encoder.encode(env.JWT_SECRET));
}

async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, encoder.encode(env.JWT_SECRET));
  const email = typeof payload.email === "string" ? payload.email : "";
  const role = payload.role === "admin" ? "admin" : null;

  if (!email || !role) {
    return null;
  }

  return {
    email,
    role,
  } satisfies SessionPayload;
}

export async function setAdminSession() {
  const token = await signSession({
    email: env.ADMIN_EMAIL,
    role: "admin",
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const payload = await verifySessionToken(token);
    if (!payload) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export const sessionCookieName = COOKIE_NAME;
