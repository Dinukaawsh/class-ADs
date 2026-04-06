import { model, models, Schema, type InferSchemaType } from "mongoose";

const adSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 140,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      minlength: 12,
      maxlength: 220,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

adSchema.index({ createdAt: -1 });

export type AdDocument = InferSchemaType<typeof adSchema> & {
  _id: { toString(): string };
  createdAt: Date;
  updatedAt: Date;
};

export const AdModel = models.Ad || model("Ad", adSchema);
