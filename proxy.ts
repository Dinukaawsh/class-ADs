import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) return new Uint8Array();
  return new TextEncoder().encode(secret);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value;
    const secret = getSecret();
    if (token && secret.length > 0) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } catch {
        // no-op
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const secret = getSecret();
    if (secret.length === 0) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
