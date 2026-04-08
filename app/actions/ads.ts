"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { connectToDatabase } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";
import { Ad } from "@/models/Ad";
import mongoose from "mongoose";
// Constants imported for validation only — not re-exported from "use server" file

const createSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  body: z.string().trim().min(1, "Description is required").max(8000),
  subject: z.string().trim().min(1, "Subject is required").max(120),
  grade: z.string().trim().min(1, "Grade level is required").max(60),
  district: z.string().trim().min(1, "District is required").max(60),
  city: z.string().trim().max(100).optional().default(""),
  classType: z.string().trim().max(30).optional().default("Online"),
  price: z.string().trim().max(100).optional().default(""),
  tutorName: z.string().trim().min(1, "Tutor name is required").max(200),
  tutorQualification: z.string().trim().max(500).optional().default(""),
  phone: z.string().trim().max(20).optional().default(""),
  whatsapp: z.string().trim().max(20).optional().default(""),
  email: z.string().trim().max(200).optional().default(""),
});

export type CreateAdState = { error?: string; success?: boolean };

export async function createAd(
  _prev: CreateAdState | undefined,
  formData: FormData
): Promise<CreateAdState> {
  const parsed = createSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    subject: formData.get("subject"),
    grade: formData.get("grade"),
    district: formData.get("district"),
    city: formData.get("city"),
    classType: formData.get("classType"),
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
    if (imageFile.type !== "image/png") {
      return { error: "Please upload a PNG image only." };
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return { error: "PNG image must be 5MB or smaller." };
    }

    try {
      const bytes = Buffer.from(await imageFile.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public", "uploads", "classes");
      await mkdir(uploadDir, { recursive: true });
      const safeTitle = parsed.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50);
      const filename = `${Date.now()}-${safeTitle || "class"}.png`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, bytes);
      uploadedImagePath = `/uploads/classes/${filename}`;
    } catch {
      return { error: "Could not upload the image. Please try again." };
    }
  }

  try {
    await connectToDatabase();
    await Ad.create({
      ...parsed.data,
      imageUrl: uploadedImagePath,
      className: parsed.data.subject,
      contact: parsed.data.phone || parsed.data.email || "",
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
  revalidatePath("/admin");
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
  revalidatePath("/admin");
  revalidatePath("/");
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
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
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

