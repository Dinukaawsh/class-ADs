"use client";

import { useEffect, useRef, useState } from "react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Toast } from "@/components/ui/toast";
import { logoutUser } from "@/app/actions/user-auth";

export function LogoutButton() {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenConfirm(true)}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted"
      >
        Logout
      </button>

      <ConfirmationModal
        open={openConfirm}
        title="Log out now?"
        message="You will need to login again to manage your ads."
        cancelLabel="Stay logged in"
        confirmLabel="Log out"
        confirmTone="primary"
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => {
          setOpenConfirm(false);
          setToastMessage("Logging out...");
          timeoutRef.current = window.setTimeout(() => {
            void logoutUser();
          }, 500);
        }}
      />

      <Toast message={toastMessage} type="info" />
    </>
  );
}
