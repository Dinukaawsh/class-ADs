"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { headers } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { getAdminFromCookies, getUserFromCookies } from "@/lib/auth";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { Ad } from "@/models/Ad";
import { EmailOtp } from "@/models/EmailOtp";
import { sendOtpEmail } from "@/lib/email";
import { generateOtpCode, hashOtpCode } from "@/lib/otp";
import { uploadClassImageToCloudinary } from "@/lib/cloudinary";
import mongoose from "mongoose";
// Constants imported for validation only — not re-exported from "use server" file

const createSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  body: z.string().trim().min(1, "Description is required").max(8000),
  subject: z.string().trim().min(1, "Subject is required").max(120),
  grade: z.string().trim().min(1, "Grade level is required").max(60),
  district: z.string().trim().min(1, "District is required").max(60),
  city: z.string().trim().max(100).optional().default(""),
  mapLocationUrl: z.union([z.literal(""), z.string().trim().url("Enter a valid Google Maps URL")]).optional().default(""),
  classType: z.string().trim().max(30).optional().default("Online"),
  bannerType: z.enum(["premium", "normal"]).default("normal"),
  price: z.string().trim().max(100).optional().default(""),
  tutorName: z.string().trim().min(1, "Tutor name is required").max(200),
  tutorQualification: z.string().trim().max(500).optional().default(""),
  phone: z.string().trim().max(20).optional().default(""),
  whatsapp: z.string().trim().max(20).optional().default(""),
  email: z.string().trim().max(200).optional().default(""),
});

const adminAdUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(8000),
  subject: z.string().trim().min(1).max(120),
  grade: z.string().trim().min(1).max(60),
  district: z.string().trim().min(1).max(60),
  city: z.string().trim().max(100).optional().default(""),
  mapLocationUrl: z.union([z.literal(""), z.string().trim().url()]).optional().default(""),
  classType: z.string().trim().min(1).max(30),
  tutorName: z.string().trim().min(1).max(200),
  tutorQualification: z.string().trim().max(500).optional().default(""),
  phone: z.string().trim().max(20).optional().default(""),
  whatsapp: z.string().trim().max(20).optional().default(""),
  email: z.string().trim().max(200).optional().default(""),
  price: z.string().trim().max(100).optional().default(""),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  isFeatured: z.boolean().default(false),
  bannerType: z.enum(["premium", "normal"]).default("normal"),
});

const ownAdUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(8000),
  subject: z.string().trim().min(1).max(120),
  grade: z.string().trim().min(1).max(60),
  district: z.string().trim().min(1).max(60),
  city: z.string().trim().max(100).optional().default(""),
  mapLocationUrl: z.union([z.literal(""), z.string().trim().url()]).optional().default(""),
  classType: z.string().trim().min(1).max(30),
  tutorName: z.string().trim().min(1).max(200),
  tutorQualification: z.string().trim().max(500).optional().default(""),
  phone: z.string().trim().max(20).optional().default(""),
  whatsapp: z.string().trim().max(20).optional().default(""),
  email: z.string().trim().max(200).optional().default(""),
  price: z.string().trim().max(100).optional().default(""),
});

export type CreateAdState = { error?: string; success?: boolean };

export async function createAd(
  _prev: CreateAdState | undefined,
  formData: FormData
): Promise<CreateAdState> {
  const user = await getUserFromCookies();
  const admin = await getAdminFromCookies();
  if ((!user?.sub || !user?.email) && !admin?.email) {
    return { error: "Please login before posting an ad." };
  }

  const enforceTurnstile = process.env.NODE_ENV === "production";
  if (enforceTurnstile) {
    const turnstileToken = formData.get("cf-turnstile-response");
    if (typeof turnstileToken !== "string" || !turnstileToken.trim()) {
      return { error: "Please complete the human verification challenge." };
    }
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for") ?? "";
    const remoteIp = forwardedFor.split(",")[0]?.trim();
    const validTurnstile = await verifyTurnstileToken(turnstileToken, remoteIp);
    if (!validTurnstile) {
      return { error: "Human verification failed. Please try again." };
    }
  }

  const parsed = createSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    subject: formData.get("subject"),
    grade: formData.get("grade"),
    district: formData.get("district"),
    city: formData.get("city"),
    mapLocationUrl: formData.get("mapLocationUrl"),
    classType: formData.get("classType"),
    bannerType: formData.get("bannerType"),
    price: formData.get("price"),
    tutorName: formData.get("tutorName"),
    tutorQualification: formData.get("tutorQualification"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    const errors = parsed.error.flatten();
    const msg =
      Object.values(errors.fieldErrors).flat().join(". ") ||
      errors.formErrors.join(" ");
    return { error: msg || "Please check all fields." };
  }

  let uploadedImagePath = "";
  const imageFile = formData.get("imageFile");
  if (imageFile instanceof File && imageFile.size > 0) {
    const allowedMimeTypes = new Set(["image/png", "image/webp"]);
    if (!allowedMimeTypes.has(imageFile.type)) {
      return { error: "Please upload PNG or WEBP image only." };
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return { error: "Image must be 5MB or smaller." };
    }

    try {
      const bytes = Buffer.from(await imageFile.arrayBuffer());
      const safeTitle = parsed.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50);

      const format = imageFile.type === "image/webp" ? "webp" : "png";
      uploadedImagePath = await uploadClassImageToCloudinary({
        bytes,
        filenameBase: safeTitle || "class",
        format,
      });
    } catch {
      return { error: "Could not upload the image. Please try again." };
    }
  }

  try {
    await connectToDatabase();
    const ownerUserId = user?.sub ? String(user.sub) : "";
    const ownerEmail = user?.email
      ? String(user.email)
      : admin?.email
        ? String(admin.email)
        : "";

    await Ad.create({
      ...parsed.data,
      imageUrl: uploadedImagePath,
      className: parsed.data.subject,
      contact: parsed.data.phone || parsed.data.email || "",
      ownerUserId,
      ownerEmail,
      status: "pending",
    });
  } catch {
    return { error: "Could not save your ad. Try again later." };
  }
  revalidatePath("/");
  return { success: true };
}

export async function approveAd(id: string): Promise<void> {
  await setAdStatus(id, "approved");
}

export async function rejectAd(id: string): Promise<void> {
  await setAdStatus(id, "rejected");
}

export async function setAdStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<{ error?: string }> {
  const admin = await getAdminFromCookies();
  if (!admin) return { error: "Unauthorized" };
  if (!mongoose.isValidObjectId(id)) return { error: "Invalid id" };
  try {
    await connectToDatabase();
    const updated = await Ad.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return { error: "Not found" };
  } catch {
    return { error: "Update failed" };
  }
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  revalidatePath(`/ads/${id}`);
  return {};
}

export async function toggleFeatured(id: string): Promise<void> {
  const admin = await getAdminFromCookies();
  if (!admin) return;
  if (!mongoose.isValidObjectId(id)) return;
  try {
    await connectToDatabase();
    const doc = await Ad.findById(id);
    if (!doc) return;
    doc.isFeatured = !doc.isFeatured;
    await doc.save();
  } catch {
    return;
  }
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export type AdminAdUpdatePayload = z.infer<typeof adminAdUpdateSchema>;

export async function updateAdByAdmin(
  id: string,
  payload: AdminAdUpdatePayload,
  imageFile?: File | null
): Promise<{ error?: string }> {
  const admin = await getAdminFromCookies();
  if (!admin) return { error: "Unauthorized" };
  if (!mongoose.isValidObjectId(id)) return { error: "Invalid id" };

  const parsed = adminAdUpdateSchema.safeParse(payload);
  if (!parsed.success) return { error: "Invalid ad update payload." };

  let uploadedImagePath: string | undefined;
  if (imageFile instanceof File && imageFile.size > 0) {
    const allowedMimeTypes = new Set(["image/png", "image/webp"]);
    if (!allowedMimeTypes.has(imageFile.type)) {
      return { error: "Please upload PNG or WEBP image only." };
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return { error: "Image must be 5MB or smaller." };
    }

    try {
      const bytes = Buffer.from(await imageFile.arrayBuffer());
      const safeTitle = parsed.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50);
      const format = imageFile.type === "image/webp" ? "webp" : "png";
      uploadedImagePath = await uploadClassImageToCloudinary({
        bytes,
        filenameBase: safeTitle || "class",
        format,
      });
    } catch {
      return { error: "Could not upload the image. Please try again." };
    }
  }

  try {
    await connectToDatabase();
    const updated = await Ad.findByIdAndUpdate(
      id,
      {
        ...parsed.data,
        className: parsed.data.subject,
        contact: parsed.data.phone || parsed.data.email || "",
        ...(uploadedImagePath ? { imageUrl: uploadedImagePath } : {}),
      },
      { new: true }
    );
    if (!updated) return { error: "Not found" };
  } catch {
    return { error: "Update failed" };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  revalidatePath(`/ads/${id}`);
  return {};
}

export async function updateAdByAdminFromForm(
  id: string,
  formData: FormData
): Promise<void> {
  await updateAdByAdmin(id, {
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    grade: String(formData.get("grade") ?? ""),
    district: String(formData.get("district") ?? ""),
    city: String(formData.get("city") ?? ""),
    mapLocationUrl: String(formData.get("mapLocationUrl") ?? ""),
    classType: String(formData.get("classType") ?? ""),
    tutorName: String(formData.get("tutorName") ?? ""),
    tutorQualification: String(formData.get("tutorQualification") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    email: String(formData.get("email") ?? ""),
    price: String(formData.get("price") ?? ""),
    status: (String(formData.get("status") ?? "pending") as "pending" | "approved" | "rejected"),
    isFeatured: String(formData.get("isFeatured") ?? "false") === "true",
    bannerType: (String(formData.get("bannerType") ?? "normal") as "premium" | "normal"),
  }, (formData.get("imageFile") as File | null) ?? null);
}

export async function deleteAd(id: string): Promise<void> {
  const admin = await getAdminFromCookies();
  if (!admin) return;
  if (!mongoose.isValidObjectId(id)) return;
  try {
    await connectToDatabase();
    const deleted = await Ad.findByIdAndDelete(id);
    if (!deleted) return;
  } catch {
    return;
  }
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard");
}

export async function deleteAdByAdmin(id: string): Promise<{ error?: string; success?: boolean }> {
  const admin = await getAdminFromCookies();
  if (!admin) return { error: "Unauthorized" };
  if (!mongoose.isValidObjectId(id)) return { error: "Invalid id" };
  try {
    await connectToDatabase();
    const deleted = await Ad.findByIdAndDelete(id);
    if (!deleted) return { error: "Not found" };
  } catch {
    return { error: "Delete failed" };
  }
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  return { success: true };
}

export async function incrementViews(id: string): Promise<void> {
  if (!mongoose.isValidObjectId(id)) return;
  try {
    await connectToDatabase();
    await Ad.findByIdAndUpdate(id, { $inc: { views: 1 } });
  } catch {
    // Non-critical - silently ignore
  }
}

export async function incrementContactClicks(id: string): Promise<void> {
  if (!mongoose.isValidObjectId(id)) return;
  try {
    await connectToDatabase();
    await Ad.findByIdAndUpdate(id, { $inc: { contactClicks: 1 } });
  } catch {
    // Non-critical
  }
}

export async function updateOwnAd(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const user = await getUserFromCookies();
  if (!user?.sub) return { error: "Unauthorized" };
  if (!mongoose.isValidObjectId(id)) return { error: "Invalid id" };

  const parsed = ownAdUpdateSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    grade: String(formData.get("grade") ?? ""),
    district: String(formData.get("district") ?? ""),
    city: String(formData.get("city") ?? ""),
    mapLocationUrl: String(formData.get("mapLocationUrl") ?? ""),
    classType: String(formData.get("classType") ?? ""),
    tutorName: String(formData.get("tutorName") ?? ""),
    tutorQualification: String(formData.get("tutorQualification") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    email: String(formData.get("email") ?? ""),
    price: String(formData.get("price") ?? ""),
  });
  if (!parsed.success) return { error: "Invalid ad details." };

  let uploadedImagePath: string | undefined;
  const imageFile = formData.get("imageFile");
  if (imageFile instanceof File && imageFile.size > 0) {
    const allowedMimeTypes = new Set(["image/png", "image/webp"]);
    if (!allowedMimeTypes.has(imageFile.type)) {
      return { error: "Please upload PNG or WEBP image only." };
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return { error: "Image must be 5MB or smaller." };
    }

    try {
      const bytes = Buffer.from(await imageFile.arrayBuffer());
      const safeTitle = parsed.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50);
      const format = imageFile.type === "image/webp" ? "webp" : "png";
      uploadedImagePath = await uploadClassImageToCloudinary({
        bytes,
        filenameBase: safeTitle || "class",
        format,
      });
    } catch {
      return { error: "Could not upload the image. Please try again." };
    }
  }

  try {
    await connectToDatabase();
    const updated = await Ad.findOneAndUpdate(
      { _id: id, ownerUserId: String(user.sub) },
      {
        ...parsed.data,
        className: parsed.data.subject,
        ...(uploadedImagePath ? { imageUrl: uploadedImagePath } : {}),
      },
      { new: true }
    );
    if (!updated) return { error: "Ad not found." };
  } catch {
    return { error: "Could not update ad." };
  }

  revalidatePath("/account/ads");
  revalidatePath(`/ads/${id}`);
  return { success: true };
}

export async function requestDeleteAdOtp(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const user = await getUserFromCookies();
  if (!user?.sub || !user?.email) return { error: "Unauthorized" };
  if (!mongoose.isValidObjectId(id)) return { error: "Invalid id" };

  await connectToDatabase();
  const ad = await Ad.findOne({ _id: id, ownerUserId: String(user.sub) }).lean();
  if (!ad) return { error: "Ad not found." };

  const code = generateOtpCode();
  await EmailOtp.create({
    email: String(user.email).toLowerCase(),
    purpose: "delete_ad",
    codeHash: hashOtpCode(code),
    adId: id,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  const sent = await sendOtpEmail(String(user.email), code, "Confirm ad deletion");
  if (!sent) return { error: "Could not send OTP email." };
  return { success: true };
}

export async function verifyDeleteOwnAdOtp(
  id: string,
  otp: string
): Promise<{ error?: string; success?: boolean }> {
  const user = await getUserFromCookies();
  if (!user?.sub || !user?.email) return { error: "Unauthorized" };
  if (!mongoose.isValidObjectId(id)) return { error: "Invalid id" };

  const normalizedOtp = otp.trim();
  if (!normalizedOtp) return { error: "OTP is required." };

  await connectToDatabase();
  const otpDoc = await EmailOtp.findOne({
    email: String(user.email).toLowerCase(),
    purpose: "delete_ad",
    adId: id,
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!otpDoc) return { error: "OTP not found." };
  if (new Date(otpDoc.expiresAt).getTime() < Date.now()) return { error: "OTP expired." };
  if (hashOtpCode(normalizedOtp) !== String(otpDoc.codeHash ?? "")) {
    return { error: "Invalid OTP." };
  }
  return { success: true };
}

export async function confirmDeleteOwnAd(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const otp = String(formData.get("otp") ?? "");
  const verified = await verifyDeleteOwnAdOtp(id, otp);
  if (!verified.success) return verified;

  const user = await getUserFromCookies();
  if (!user?.sub) return { error: "Unauthorized" };

  const deleted = await Ad.findOneAndDelete({
    _id: id,
    ownerUserId: String(user.sub),
  });
  if (!deleted) return { error: "Ad not found." };

  revalidatePath("/account/ads");
  revalidatePath("/");
  return { success: true };
}

