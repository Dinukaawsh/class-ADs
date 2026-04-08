"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { Institute } from "@/models/Institute";

const createInstituteSchema = z.object({
  name: z.string().trim().min(2, "Institute name is required").max(180),
  logoUrl: z.string().trim().max(500).optional().default(""),
  district: z.string().trim().min(1, "District is required").max(80),
  city: z.string().trim().max(120).optional().default(""),
  subjects: z.string().trim().min(1, "At least one subject is required").max(1000),
  description: z.string().trim().min(20, "Description is too short").max(5000),
  website: z.string().trim().max(500).optional().default(""),
  phone: z.string().trim().max(30).optional().default(""),
  whatsapp: z.string().trim().max(30).optional().default(""),
  email: z.string().trim().max(220).optional().default(""),
  grades: z.string().trim().max(600).optional().default(""),
  schedules: z.string().trim().max(800).optional().default(""),
  classModes: z.string().trim().max(120).optional().default("Physical"),
  courses: z.string().trim().max(3000).optional().default(""),
  lecturers: z.string().trim().max(2000).optional().default(""),
  facilities: z.string().trim().max(1200).optional().default(""),
  galleryImages: z.string().trim().max(2000).optional().default(""),
  isFeatured: z
    .string()
    .optional()
    .transform((v) => v === "on"),
});

export type CreateInstituteState = { error?: string; success?: boolean };

function toList(value: string): string[] {
  return value
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createInstitute(
  _prev: CreateInstituteState | undefined,
  formData: FormData
): Promise<CreateInstituteState> {
  const parsed = createInstituteSchema.safeParse({
    name: formData.get("name"),
    logoUrl: formData.get("logoUrl"),
    district: formData.get("district"),
    city: formData.get("city"),
    subjects: formData.get("subjects"),
    description: formData.get("description"),
    website: formData.get("website"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    grades: formData.get("grades"),
    schedules: formData.get("schedules"),
    classModes: formData.get("classModes"),
    courses: formData.get("courses"),
    lecturers: formData.get("lecturers"),
    facilities: formData.get("facilities"),
    galleryImages: formData.get("galleryImages"),
    isFeatured: formData.get("isFeatured"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten();
    const msg =
      Object.values(errors.fieldErrors).flat().join(". ") ||
      errors.formErrors.join(" ");
    return { error: msg || "Please check all fields." };
  }

  try {
    await connectToDatabase();

    const baseSlug = slugify(parsed.data.name);
    const suffix = Math.random().toString(36).slice(2, 7);
    const slug = `${baseSlug}-${suffix}`;

    const courses = parsed.data.courses
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({
        title: line,
        subject: "",
        level: "",
        schedule: "",
        mode: "Physical" as const,
      }));

    const lecturers = parsed.data.lecturers
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({
        name: line,
        qualification: "",
      }));

    const classModes = toList(parsed.data.classModes).filter((m) =>
      ["Online", "Physical", "Hybrid"].includes(m)
    );

    await Institute.create({
      name: parsed.data.name,
      slug,
      logoUrl: parsed.data.logoUrl,
      district: parsed.data.district,
      city: parsed.data.city,
      subjects: toList(parsed.data.subjects),
      description: parsed.data.description,
      website: parsed.data.website,
      phone: parsed.data.phone,
      whatsapp: parsed.data.whatsapp,
      email: parsed.data.email,
      grades: toList(parsed.data.grades),
      schedules: toList(parsed.data.schedules),
      classModes: classModes.length > 0 ? classModes : ["Physical"],
      courses,
      lecturers,
      facilities: toList(parsed.data.facilities),
      galleryImages: toList(parsed.data.galleryImages),
      totalCourses: courses.length,
      isFeatured: parsed.data.isFeatured,
      isVerified: true,
      status: "approved",
      reviewCount: 0,
      rating: 4.5,
    });
  } catch {
    return { error: "Could not create institute profile. Please try again." };
  }

  revalidatePath("/institutes");
  revalidatePath("/institutes/dashboard");
  return { success: true };
}

export async function incrementInstituteViews(id: string): Promise<void> {
  if (!mongoose.isValidObjectId(id)) return;
  try {
    await connectToDatabase();
    await Institute.findByIdAndUpdate(id, { $inc: { views: 1 } });
  } catch {
    // Non-critical
  }
}

export async function incrementInstituteInquiry(id: string): Promise<void> {
  if (!mongoose.isValidObjectId(id)) return;
  try {
    await connectToDatabase();
    await Institute.findByIdAndUpdate(id, { $inc: { inquiryCount: 1 } });
  } catch {
    // Non-critical
  }
}
