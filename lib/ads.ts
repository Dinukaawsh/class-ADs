import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/db";
import { AdModel, type AdDocument } from "@/lib/models/ad";

export type AdView = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  price: number;
  location: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
};

function isMongoUnavailable(error: unknown) {
  return error instanceof Error && /ECONNREFUSED|MongooseServerSelectionError|Server selection timed out/i.test(error.message);
}

function toView(doc: AdDocument): AdView {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    summary: doc.summary,
    description: doc.description,
    category: doc.category,
    price: doc.price,
    location: doc.location,
    contactName: doc.contactName,
    contactEmail: doc.contactEmail,
    phone: doc.phone,
    imageUrl: doc.imageUrl,
    isPublished: doc.isPublished,
    createdAt: doc.createdAt.toISOString(),
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function listPublishedAds() {
  try {
    await connectToDatabase();
    const docs = (await AdModel.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean()) as AdDocument[];
    return docs.map(toView);
  } catch (error) {
    if (!isMongoUnavailable(error)) {
      throw error;
    }
    return [];
  }
}

export async function listAllAds() {
  try {
    await connectToDatabase();
    const docs = (await AdModel.find({}).sort({ createdAt: -1 }).lean()) as AdDocument[];
    return docs.map(toView);
  } catch (error) {
    if (!isMongoUnavailable(error)) {
      throw error;
    }
    return [];
  }
}

export async function getAdBySlug(slug: string) {
  try {
    await connectToDatabase();
    const doc = (await AdModel.findOne({ slug, isPublished: true }).lean()) as
      | AdDocument
      | null;
    return doc ? toView(doc) : null;
  } catch (error) {
    if (!isMongoUnavailable(error)) {
      throw error;
    }
    return null;
  }
}

export async function getAdById(id: string) {
  try {
    await connectToDatabase();
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = (await AdModel.findById(id).lean()) as AdDocument | null;
    return doc ? toView(doc) : null;
  } catch (error) {
    if (!isMongoUnavailable(error)) {
      throw error;
    }
    return null;
  }
}

export async function createAd(input: {
  title: string;
  summary: string;
  description: string;
  category: string;
  price: number;
  location: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  imageUrl?: string;
  isPublished: boolean;
}) {
  const baseSlug = slugify(input.title);
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    await connectToDatabase();
    const doc = await AdModel.create({
      ...input,
      slug,
    });

    return toView(doc.toObject() as AdDocument);
  } catch (error) {
    if (!isMongoUnavailable(error)) {
      throw error;
    }
    throw error;
  }
}

export async function updateAd(
  id: string,
  input: {
    title: string;
    summary: string;
    description: string;
    category: string;
    price: number;
    location: string;
    contactName: string;
    contactEmail: string;
    phone: string;
    imageUrl?: string;
    isPublished: boolean;
  }
) {
  try {
    await connectToDatabase();
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const current = await AdModel.findById(id);
    if (!current) {
      return null;
    }

    const nextSlug =
      current.title !== input.title
        ? `${slugify(input.title)}-${Math.random().toString(36).slice(2, 8)}`
        : current.slug;

    const updated = (await AdModel.findByIdAndUpdate(
      id,
      {
        ...input,
        slug: nextSlug,
      },
      { new: true }
    ).lean()) as AdDocument | null;

    return updated ? toView(updated) : null;
  } catch (error) {
    if (!isMongoUnavailable(error)) {
      throw error;
    }
    throw error;
  }
}

export async function deleteAd(id: string) {
  try {
    await connectToDatabase();
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await AdModel.findByIdAndDelete(id);
    return Boolean(result);
  } catch (error) {
    if (!isMongoUnavailable(error)) {
      throw error;
    }
    throw error;
  }
}
