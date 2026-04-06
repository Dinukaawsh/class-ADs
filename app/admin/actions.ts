"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminSession } from "@/lib/auth";
import { createAd, deleteAd, updateAd } from "@/lib/ads";

const adSchema = z.object({
  title: z.string().min(4).max(140),
  summary: z.string().min(12).max(220),
  description: z.string().min(20).max(5000),
  category: z.string().min(2).max(60),
  price: z.coerce.number().nonnegative(),
  location: z.string().min(2).max(120),
  contactName: z.string().min(2).max(80),
  contactEmail: z.email(),
  phone: z.string().min(5).max(30),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isPublished: z
    .union([z.literal("on"), z.literal("true"), z.literal("false")])
    .transform((value) => value === "on" || value === "true"),
});

function parseAdForm(formData: FormData) {
  return adSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    category: formData.get("category"),
    price: formData.get("price"),
    location: formData.get("location"),
    contactName: formData.get("contactName"),
    contactEmail: formData.get("contactEmail"),
    phone: formData.get("phone"),
    imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    isPublished: formData.get("isPublished") ? "on" : "false",
  });
}

function validationRedirect(path: string) {
  redirect(`${path}?error=Please%20fix%20the%20highlighted%20fields.`);
}

export async function createAdAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }
  const parsed = parseAdForm(formData);
  if (!parsed.success) {
    validationRedirect("/admin/new");
    return;
  }
  const input = parsed.data;
  await createAd(input);

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateAdAction(id: string, formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }
  const parsed = parseAdForm(formData);
  if (!parsed.success) {
    validationRedirect(`/admin/${id}/edit`);
    return;
  }
  const input = parsed.data;
  await updateAd(id, input);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/ads`);
  redirect("/admin");
}

export async function deleteAdAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }
  const idResult = z.string().min(12).safeParse(formData.get("id"));
  if (!idResult.success) {
    redirect("/admin?error=Invalid%20request");
    return;
  }
  const id = idResult.data;
  await deleteAd(id);

  revalidatePath("/");
  revalidatePath("/admin");
}
