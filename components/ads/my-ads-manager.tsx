"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { updateOwnAd, requestDeleteAdOtp, verifyDeleteOwnAdOtp, confirmDeleteOwnAd } from "@/app/actions/ads";
import { Modal } from "@/components/ui/modal";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Toast } from "@/components/ui/toast";

type MyAd = {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  district: string;
  classType: string;
  tutorName: string;
  price: string;
  body: string;
  status: string;
  createdAt: string;
};

type EditState = Omit<MyAd, "_id" | "status" | "createdAt">;

const fieldClass =
  "w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10";

export function MyAdsManager({ ads }: { ads: MyAd[] }) {
  const router = useRouter();
  const [toast, setToast] = useState<{ message?: string; type?: "success" | "error" | "info" }>({});

  const [editTarget, setEditTarget] = useState<MyAd | null>(null);
  const [editState, setEditState] = useState<EditState>({
    title: "",
    subject: "",
    grade: "",
    district: "",
    classType: "",
    tutorName: "",
    price: "",
    body: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<MyAd | null>(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const sortedAds = useMemo(
    () => [...ads].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [ads]
  );

  function openEdit(ad: MyAd) {
    setEditTarget(ad);
    setEditState({
      title: ad.title,
      subject: ad.subject,
      grade: ad.grade,
      district: ad.district,
      classType: ad.classType,
      tutorName: ad.tutorName,
      price: ad.price,
      body: ad.body,
    });
  }

  async function saveEdit() {
    if (!editTarget) return;
    setSavingEdit(true);
    const formData = new FormData();
    formData.set("title", editState.title);
    formData.set("subject", editState.subject);
    formData.set("grade", editState.grade);
    formData.set("district", editState.district);
    formData.set("classType", editState.classType);
    formData.set("tutorName", editState.tutorName);
    formData.set("price", editState.price);
    formData.set("body", editState.body);
    const result = await updateOwnAd(editTarget._id, formData);
    setSavingEdit(false);
    if (result?.error) {
      setToast({ message: result.error, type: "error" });
      return;
    }
    setEditTarget(null);
    setToast({ message: "Ad updated successfully.", type: "success" });
    router.refresh();
  }

  function openDelete(ad: MyAd) {
    setDeleteTarget(ad);
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setDeleteConfirmOpen(false);
  }

  async function sendOtp() {
    if (!deleteTarget) return;
    setOtpBusy(true);
    const result = await requestDeleteAdOtp(deleteTarget._id);
    setOtpBusy(false);
    if (result?.error) {
      setToast({ message: result.error, type: "error" });
      return;
    }
    setOtpSent(true);
    setToast({ message: "OTP sent to your email.", type: "success" });
  }

  async function verifyOtp() {
    if (!deleteTarget) return;
    setOtpBusy(true);
    const result = await verifyDeleteOwnAdOtp(deleteTarget._id, otp);
    setOtpBusy(false);
    if (result?.error) {
      setToast({ message: result.error, type: "error" });
      return;
    }
    setOtpVerified(true);
    setToast({ message: "OTP verified successfully.", type: "success" });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    const formData = new FormData();
    formData.set("otp", otp);
    const result = await confirmDeleteOwnAd(deleteTarget._id, formData);
    setDeleteBusy(false);
    if (result?.error) {
      setToast({ message: result.error, type: "error" });
      return;
    }
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
    setToast({ message: "Ad deleted successfully.", type: "success" });
    router.refresh();
  }

  return (
    <>
      <Toast message={toast.message} type={toast.type ?? "info"} />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {sortedAds.map((ad) => (
          <div key={ad._id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="line-clamp-1 text-lg font-semibold text-foreground">{ad.title}</h2>
                <p className="mt-1 text-xs text-muted">
                  {ad.subject} • {ad.grade} • {ad.district}
                </p>
              </div>
              <span className="rounded-full bg-surface-alt px-2.5 py-1 text-[11px] font-semibold uppercase text-primary">
                {ad.status}
              </span>
            </div>

            <p className="mt-3 line-clamp-2 text-sm text-muted">{ad.body || "No description provided."}</p>

            <div className="mt-4 flex items-center justify-between">
              <Link href={`/ads/${ad._id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                <FiEye size={14} />
                View
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(ad)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition hover:bg-surface-alt"
                  aria-label="Edit ad"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => openDelete(ad)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                  aria-label="Delete ad"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal title="Edit Ad" open={Boolean(editTarget)} maxWidthClass="max-w-2xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={editState.title} onChange={(e) => setEditState((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className={fieldClass} />
          <input value={editState.subject} onChange={(e) => setEditState((p) => ({ ...p, subject: e.target.value }))} placeholder="Subject" className={fieldClass} />
          <input value={editState.grade} onChange={(e) => setEditState((p) => ({ ...p, grade: e.target.value }))} placeholder="Grade" className={fieldClass} />
          <input value={editState.district} onChange={(e) => setEditState((p) => ({ ...p, district: e.target.value }))} placeholder="District" className={fieldClass} />
          <input value={editState.classType} onChange={(e) => setEditState((p) => ({ ...p, classType: e.target.value }))} placeholder="Class type" className={fieldClass} />
          <input value={editState.tutorName} onChange={(e) => setEditState((p) => ({ ...p, tutorName: e.target.value }))} placeholder="Tutor name" className={fieldClass} />
          <input value={editState.price} onChange={(e) => setEditState((p) => ({ ...p, price: e.target.value }))} placeholder="Price" className={fieldClass} />
          <textarea value={editState.body} onChange={(e) => setEditState((p) => ({ ...p, body: e.target.value }))} rows={4} placeholder="Description" className={`${fieldClass} sm:col-span-2`} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setEditTarget(null)} className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-alt">
            Cancel
          </button>
          <button type="button" onClick={saveEdit} disabled={savingEdit} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60">
            {savingEdit ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Modal>

      <Modal title="Delete Ad with OTP" open={Boolean(deleteTarget)}>
        <p className="text-sm text-muted">
          Send OTP to your email, verify it, then proceed to final delete confirmation.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={sendOtp} disabled={otpBusy} className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-alt disabled:opacity-60">
            {otpBusy ? "Sending..." : "Send OTP"}
          </button>
          <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-alt">
            Close
          </button>
        </div>
        <div className="mt-4">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className={fieldClass}
          />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={verifyOtp}
              disabled={otpBusy || !otp.trim() || !otpSent}
              className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
            >
              {otpBusy ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={!otpVerified}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              <FiTrash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        open={deleteConfirmOpen}
        title="Delete this ad?"
        message="This action cannot be undone."
        confirmLabel={deleteBusy ? "Deleting..." : "Delete"}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
