"use client";

export function Toast({
  message,
  type = "info",
}: {
  message?: string;
  type?: "success" | "error" | "info";
}) {
  if (!message) return null;

  const color =
    type === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : type === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-blue-200 bg-blue-50 text-blue-800";

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[10000] max-w-sm">
      <div className={`animate-fade-in rounded-xl border px-4 py-3 text-sm shadow-lg ${color}`}>
        {message}
      </div>
    </div>
  );
}
