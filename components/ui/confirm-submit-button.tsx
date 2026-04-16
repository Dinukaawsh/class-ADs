"use client";

import { useRef, useState } from "react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export function ConfirmSubmitButton({
  label,
  className,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  tone = "danger",
}: {
  label: string;
  className?: string;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  function submitParentForm() {
    const form = btnRef.current?.form;
    if (!form) return;
    setOpen(false);
    form.requestSubmit();
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {label}
      </button>
      <ConfirmationModal
        open={open}
        title={title}
        message={message}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        confirmTone={tone}
        onCancel={() => setOpen(false)}
        onConfirm={submitParentForm}
      />
    </>
  );
}
