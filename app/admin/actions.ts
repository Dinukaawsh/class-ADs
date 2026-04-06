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
  return adSchema.parse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    category: formData.get("category"),
    price: formData.get("price"),
    location: formData.get("location"),
    contactName: formData.get("contactName"),
    contactEmail: formData.get("contactEmail"),
    phone: formData.get("phone"),
    imageUrl: formData.get("imageUrl") ?? "",
    isPublished: formData.get("isPublished") ? "on" : "false",
  });
}

export async function createAdAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }
  const input = parseAdForm(formData);
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
  const input = parseAdForm(formData);
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
  const id = z.string().min(12).parse(formData.get("id"));
  await deleteAd(id);

  revalidatePath("/");
  revalidatePath("/admin");
}
