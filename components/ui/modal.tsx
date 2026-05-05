import type { ReactNode } from "react";

export function Modal({
  title,
  open,
  children,
  maxWidthClass = "max-w-lg",
}: {
  title: string;
  open: boolean;
  children: ReactNode;
  maxWidthClass?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
      <div className="grid min-h-full place-items-center">
        <div className={`w-full ${maxWidthClass} max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl`}>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
