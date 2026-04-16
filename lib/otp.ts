import { createHash, randomInt } from "crypto";

export function generateOtpCode(): string {
  return String(randomInt(100000, 999999));
}

export function hashOtpCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}
