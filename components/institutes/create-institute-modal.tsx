"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { InstituteForm } from "@/components/forms/institute-form";

export function CreateInstituteModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        List Your Institute
      </button>
      <Modal title="Create Institute Profile" open={open} maxWidthClass="max-w-5xl">
        <InstituteForm inModal onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}
