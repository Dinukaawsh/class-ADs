"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { updateOwnAd, requestDeleteAdOtp, verifyDeleteOwnAdOtp, confirmDeleteOwnAd } from "@/app/actions/ads";
import { Modal } from "@/components/ui/modal";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Toast } from "@/components/ui/toast";
import { Pagination } from "@/components/ui/pagination";
import { Dropdown } from "@/components/ui/dropdown";
import { SUBJECTS, GRADES, DISTRICTS, CLASS_TYPES } from "@/lib/constants";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type MyAd = {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  district: string;
  city: string;
  classType: string;
  tutorName: string;
  tutorQualification: string;
  phone: string;
  whatsapp: string;
  email: string;
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
    city: "",
    classType: "",
    tutorName: "",
    tutorQualification: "",
    phone: "",
    whatsapp: "",
    email: "",
    price: "",
    body: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

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
  const totalPages = Math.max(1, Math.ceil(sortedAds.length / pageSize));
  const paginatedAds = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAds.slice(start, start + pageSize);
  }, [currentPage, sortedAds]);

  function openEdit(ad: MyAd) {
    setEditTarget(ad);
    setEditState({
      title: ad.title,
      subject: ad.subject,
      grade: ad.grade,
      district: ad.district,
      city: ad.city,
      classType: ad.classType,
      tutorName: ad.tutorName,
      tutorQualification: ad.tutorQualification,
      phone: ad.phone,
      whatsapp: ad.whatsapp,
      email: ad.email,
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
    formData.set("city", editState.city);
    formData.set("classType", editState.classType);
    formData.set("tutorName", editState.tutorName);
    formData.set("tutorQualification", editState.tutorQualification);
    formData.set("phone", editState.phone);
    formData.set("whatsapp", editState.whatsapp);
    formData.set("email", editState.email);
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
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {paginatedAds.map((ad) => (
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
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted">
              <p>Type: {ad.classType || "-"}</p>
              <p>City: {ad.city || "-"}</p>
              <p>Phone: {ad.phone || "-"}</p>
              <p>Price: {ad.price || "-"}</p>
            </div>

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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal title="Edit Ad" open={Boolean(editTarget)} maxWidthClass="max-w-2xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <InputGroup label="Class Title">
            <input value={editState.title} onChange={(e) => setEditState((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className={fieldClass} />
          </InputGroup>
          <InputGroup label="Subject">
            <Dropdown
              value={editState.subject}
              onChange={(value) => setEditState((p) => ({ ...p, subject: value }))}
              placeholder="Select Subject"
              options={SUBJECTS.map((item) => ({ label: item, value: item }))}
            />
          </InputGroup>
          <InputGroup label="Grade">
            <Dropdown
              value={editState.grade}
              onChange={(value) => setEditState((p) => ({ ...p, grade: value }))}
              placeholder="Select Grade"
              options={GRADES.map((item) => ({ label: item, value: item }))}
            />
          </InputGroup>
          <InputGroup label="District">
            <Dropdown
              value={editState.district}
              onChange={(value) => setEditState((p) => ({ ...p, district: value }))}
              placeholder="Select District"
              options={DISTRICTS.map((item) => ({ label: item, value: item }))}
            />
          </InputGroup>
          <InputGroup label="City">
            <input value={editState.city} onChange={(e) => setEditState((p) => ({ ...p, city: e.target.value }))} placeholder="City" className={fieldClass} />
          </InputGroup>
          <InputGroup label="Class Type">
            <Dropdown
              value={editState.classType}
              onChange={(value) => setEditState((p) => ({ ...p, classType: value }))}
              placeholder="Select Class Type"
              options={CLASS_TYPES.map((item) => ({ label: item, value: item }))}
            />
          </InputGroup>
          <InputGroup label="Tutor Name">
            <input value={editState.tutorName} onChange={(e) => setEditState((p) => ({ ...p, tutorName: e.target.value }))} placeholder="Tutor name" className={fieldClass} />
          </InputGroup>
          <InputGroup label="Tutor Qualification">
            <input value={editState.tutorQualification} onChange={(e) => setEditState((p) => ({ ...p, tutorQualification: e.target.value }))} placeholder="Tutor qualification" className={fieldClass} />
          </InputGroup>
          <InputGroup label="Phone">
            <input value={editState.phone} onChange={(e) => setEditState((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone" className={fieldClass} />
          </InputGroup>
          <InputGroup label="WhatsApp">
            <input value={editState.whatsapp} onChange={(e) => setEditState((p) => ({ ...p, whatsapp: e.target.value }))} placeholder="WhatsApp" className={fieldClass} />
          </InputGroup>
          <InputGroup label="Email">
            <input value={editState.email} onChange={(e) => setEditState((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className={fieldClass} />
          </InputGroup>
          <InputGroup label="Price">
            <input value={editState.price} onChange={(e) => setEditState((p) => ({ ...p, price: e.target.value }))} placeholder="Price" className={fieldClass} />
          </InputGroup>
          <InputGroup label="Description" className="sm:col-span-2">
            <textarea value={editState.body} onChange={(e) => setEditState((p) => ({ ...p, body: e.target.value }))} rows={4} placeholder="Description" className={fieldClass} />
          </InputGroup>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setEditTarget(null)} className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-alt">
            Cancel
          </button>
          <button type="button" onClick={saveEdit} disabled={savingEdit} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60">
            {savingEdit ? (
              <>
                <LoadingSpinner size={16} />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </Modal>

      <Modal title="Delete Ad with OTP" open={Boolean(deleteTarget)}>
        <p className="text-sm text-muted">
          Send OTP to your email, verify it, then proceed to final delete confirmation.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={sendOtp} disabled={otpBusy} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-alt disabled:opacity-60">
            {otpBusy ? (
              <>
                <LoadingSpinner size={16} />
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
            >
              {otpBusy ? (
                <>
                  <LoadingSpinner size={16} />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
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
        confirmLabel={
          deleteBusy ? (
            <span className="inline-flex items-center gap-2">
              <LoadingSpinner size={14} />
              Deleting...
            </span>
          ) : (
            "Delete"
          )
        }
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

function InputGroup({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
