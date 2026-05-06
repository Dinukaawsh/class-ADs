/** Accept only same-origin relative paths to avoid open redirects. */
export function safeCallbackUrl(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return undefined;
  return t;
}
