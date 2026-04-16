"use client";

import { incrementInstituteInquiry } from "@/app/actions/institutes";

type Props = {
  instituteId: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
};

export function InstituteContactActions({ instituteId, phone, whatsapp, email }: Props) {
  function trackInquiry() {
    incrementInstituteInquiry(instituteId);
  }

  if (!phone && !whatsapp && !email) {
    return <p className="text-sm text-muted">No contact details provided yet.</p>;
  }

  return (
    <div className="space-y-3">
      {phone && (
        <a href={`tel:${phone}`} onClick={trackInquiry} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark">
          Call Institute
        </a>
      )}
      {whatsapp && (
        <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" onClick={trackInquiry} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#20bd5a]">
          WhatsApp
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} onClick={trackInquiry} className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-alt">
          Send Inquiry Email
        </a>
      )}
    </div>
  );
}
