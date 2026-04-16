"use client";

import type { ReactNode } from "react";

export function ConfirmationModal({
  open,
  title,
  message,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  confirmTone = "danger",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message?: ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmTone?: "danger" | "primary";
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  const confirmClass =
    confirmTone === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-primary hover:bg-primary-dark text-white";

  return (
    <div className="fixed inset-0 z-[12000] grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {message ? <div className="mt-2 text-sm text-muted">{message}</div> : null}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-alt"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
