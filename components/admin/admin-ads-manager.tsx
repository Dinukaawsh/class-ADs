"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { deleteAdByAdmin, setAdStatus, updateAdByAdmin } from "@/app/actions/ads";
import { Modal } from "@/components/ui/modal";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Toast } from "@/components/ui/toast";
import { Dropdown } from "@/components/ui/dropdown";
import { SUBJECTS, GRADES, DISTRICTS, CLASS_TYPES } from "@/lib/constants";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type AdminAd = {
  _id: string;
  title: string;
  body: string;
  subject: string;
  grade: string;
  district: string;
  city: string;
  mapLocationUrl: string;
  classType: string;
  tutorName: string;
  tutorQualification: string;
  phone: string;
  whatsapp: string;
  email: string;
  price: string;
  imageUrl: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  bannerType: "premium" | "normal";
};

type EditState = Omit<AdminAd, "_id" | "imageUrl">;

const fieldClass = "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground";

export function AdminAdsManager({ ads }: { ads: AdminAd[] }) {
  const router = useRouter();
  const [toast, setToast] = useState<{ message?: string; type?: "success" | "error" | "info" }>({});
  const [editTarget, setEditTarget] = useState<AdminAd | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminAd | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({
    title: "",
    body: "",
    subject: "",
    grade: "",
    district: "",
    city: "",
    mapLocationUrl: "",
    classType: "",
    tutorName: "",
    tutorQualification: "",
    phone: "",
    whatsapp: "",
    email: "",
    price: "",
    status: "pending",
    isFeatured: false,
    bannerType: "normal",
  });

  const sortedAds = useMemo(
    () => [...ads].sort((a, b) => a.title.localeCompare(b.title)),
    [ads],
  );

  function openEdit(ad: AdminAd) {
    setEditTarget(ad);
    setEditImageFile(null);
    setEditState({
      title: ad.title,
      body: ad.body,
      subject: ad.subject,
      grade: ad.grade,
      district: ad.district,
      city: ad.city,
      mapLocationUrl: ad.mapLocationUrl,
      classType: ad.classType,
      tutorName: ad.tutorName,
      tutorQualification: ad.tutorQualification,
      phone: ad.phone,
      whatsapp: ad.whatsapp,
      email: ad.email,
      price: ad.price,
      status: ad.status,
      isFeatured: ad.isFeatured,
      bannerType: ad.bannerType,
    });
  }

  async function saveEdit() {
    if (!editTarget) return;
    setSavingEdit(true);
    const result = await updateAdByAdmin(editTarget._id, editState, editImageFile);
    setSavingEdit(false);
    if (result?.error) {
      setToast({ message: result.error, type: "error" });
      return;
    }
    setEditTarget(null);
    setEditImageFile(null);
    setToast({ message: "Ad updated successfully.", type: "success" });
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteAdByAdmin(deleteTarget._id);
    setDeleting(false);
    if (result?.error) {
      setToast({ message: result.error, type: "error" });
      return;
    }
    setDeleteTarget(null);
    setToast({ message: "Ad deleted successfully.", type: "success" });
    router.refresh();
  }

  async function changeStatus(id: string, status: "approved" | "rejected") {
    setStatusUpdatingId(id);
    const result = await setAdStatus(id, status);
    setStatusUpdatingId(null);
    if (result?.error) {
      setToast({ message: result.error, type: "error" });
      return;
    }
    setToast({
      message: status === "approved" ? "Ad approved successfully." : "Ad rejected successfully.",
      type: "success",
    });
    router.refresh();
  }

  return (
    <>
      <Toast message={toast.message} type={toast.type ?? "info"} />

      <div className="mt-4 space-y-4">
        {sortedAds.map((ad) => {
          const statusClass =
            ad.status === "approved"
              ? "bg-success/10 text-success"
              : ad.status === "rejected"
                ? "bg-red-100 text-red-600"
                : "bg-warning/10 text-warning";

          return (
            <div key={ad._id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">{ad.title}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusClass}`}>
                  {ad.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-muted">
                {ad.subject} • {ad.grade} • {ad.district}
              </p>

              <div className="mt-4 flex items-center gap-2">
                {ad.status !== "approved" ? (
                  <button
                    type="button"
                    onClick={() => changeStatus(ad._id, "approved")}
                    disabled={statusUpdatingId === ad._id}
                    className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-xs font-semibold text-success transition hover:bg-success/20 disabled:opacity-60"
                  >
                    {statusUpdatingId === ad._id ? "Updating..." : "Approve"}
                  </button>
                ) : null}
                {ad.status !== "rejected" ? (
                  <button
                    type="button"
                    onClick={() => changeStatus(ad._id, "rejected")}
                    disabled={statusUpdatingId === ad._id}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                  >
                    {statusUpdatingId === ad._id ? "Updating..." : "Reject"}
                  </button>
                ) : null}
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
                  onClick={() => setDeleteTarget(ad)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                  aria-label="Delete ad"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal title="Edit Ad (Admin)" open={Boolean(editTarget)} maxWidthClass="max-w-3xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <InputGroup label="Class Title">
            <input value={editState.title} onChange={(e) => setEditState((p) => ({ ...p, title: e.target.value }))} className={fieldClass} />
          </InputGroup>
          <InputGroup label="Subject">
            <Dropdown value={editState.subject} onChange={(value) => setEditState((p) => ({ ...p, subject: value }))} placeholder="Select Subject" options={SUBJECTS.map((v) => ({ label: v, value: v }))} />
          </InputGroup>
          <InputGroup label="Grade">
            <Dropdown value={editState.grade} onChange={(value) => setEditState((p) => ({ ...p, grade: value }))} placeholder="Select Grade" options={GRADES.map((v) => ({ label: v, value: v }))} />
          </InputGroup>
          <InputGroup label="District">
            <Dropdown value={editState.district} onChange={(value) => setEditState((p) => ({ ...p, district: value }))} placeholder="Select District" options={DISTRICTS.map((v) => ({ label: v, value: v }))} />
          </InputGroup>
          <InputGroup label="City">
            <input value={editState.city} onChange={(e) => setEditState((p) => ({ ...p, city: e.target.value }))} className={fieldClass} />
          </InputGroup>
          <InputGroup label="Class Type">
            <Dropdown value={editState.classType} onChange={(value) => setEditState((p) => ({ ...p, classType: value }))} placeholder="Select Class Type" options={CLASS_TYPES.map((v) => ({ label: v, value: v }))} />
          </InputGroup>
          <InputGroup label="Google Maps URL">
            <input value={editState.mapLocationUrl} onChange={(e) => setEditState((p) => ({ ...p, mapLocationUrl: e.target.value }))} className={fieldClass} />
          </InputGroup>
          <InputGroup label="Tutor Name">
            <input value={editState.tutorName} onChange={(e) => setEditState((p) => ({ ...p, tutorName: e.target.value }))} className={fieldClass} />
          </InputGroup>
          <InputGroup label="Tutor Qualification">
            <input value={editState.tutorQualification} onChange={(e) => setEditState((p) => ({ ...p, tutorQualification: e.target.value }))} className={fieldClass} />
          </InputGroup>
          <InputGroup label="Phone">
            <input value={editState.phone} onChange={(e) => setEditState((p) => ({ ...p, phone: e.target.value }))} className={fieldClass} />
          </InputGroup>
          <InputGroup label="WhatsApp">
            <input value={editState.whatsapp} onChange={(e) => setEditState((p) => ({ ...p, whatsapp: e.target.value }))} className={fieldClass} />
          </InputGroup>
          <InputGroup label="Email">
            <input value={editState.email} onChange={(e) => setEditState((p) => ({ ...p, email: e.target.value }))} className={fieldClass} />
          </InputGroup>
          <InputGroup label="Price">
            <input value={editState.price} onChange={(e) => setEditState((p) => ({ ...p, price: e.target.value }))} className={fieldClass} />
          </InputGroup>
          <InputGroup label="Status">
            <Dropdown
              value={editState.status}
              onChange={(value) => setEditState((p) => ({ ...p, status: value as "pending" | "approved" | "rejected" }))}
              placeholder="Select Status"
              options={[
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ]}
            />
          </InputGroup>
          <InputGroup label="Featured">
            <Dropdown
              value={editState.isFeatured ? "true" : "false"}
              onChange={(value) => setEditState((p) => ({ ...p, isFeatured: value === "true" }))}
              placeholder="Select Featured"
              options={[
                { label: "No", value: "false" },
                { label: "Yes", value: "true" },
              ]}
            />
          </InputGroup>
          <InputGroup label="Banner Type">
            <Dropdown
              value={editState.bannerType}
              onChange={(value) => setEditState((p) => ({ ...p, bannerType: value as "premium" | "normal" }))}
              placeholder="Select Banner Type"
              options={[
                { label: "Normal (Square slot)", value: "normal" },
                { label: "Premium (Rectangle slot)", value: "premium" },
              ]}
            />
          </InputGroup>
          <InputGroup label="Replace Image (PNG/WEBP, optional)" className="sm:col-span-2">
            <input
              type="file"
              accept="image/png,image/webp,.png,.webp"
              className={fieldClass}
              onChange={(e) => setEditImageFile(e.target.files?.[0] ?? null)}
            />
          </InputGroup>
          <InputGroup label="Description" className="sm:col-span-2">
            <textarea value={editState.body} onChange={(e) => setEditState((p) => ({ ...p, body: e.target.value }))} rows={4} className={fieldClass} />
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

      <ConfirmationModal
        open={Boolean(deleteTarget)}
        title="Delete this ad?"
        message="This action cannot be undone."
        confirmLabel={
          deleting ? (
            <span className="inline-flex items-center gap-2">
              <LoadingSpinner size={14} />
              Deleting...
            </span>
          ) : (
            "Delete"
          )
        }
        onCancel={() => setDeleteTarget(null)}
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
