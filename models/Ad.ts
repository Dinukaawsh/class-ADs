import { Schema, models, model } from "mongoose";

export type AdStatus = "pending" | "approved" | "rejected";

const AdSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 200, trim: true },
    body: { type: String, required: true, maxlength: 8000, trim: true },
    subject: { type: String, required: true, maxlength: 120, trim: true },
    grade: { type: String, required: true, maxlength: 60, trim: true },
    district: { type: String, required: true, maxlength: 60, trim: true },
    city: { type: String, maxlength: 100, trim: true, default: "" },
    classType: {
      type: String,
      enum: ["Online", "Physical", "Home Visit", "Group", "Individual"],
      default: "Online",
    },
    imageUrl: { type: String, maxlength: 600, trim: true, default: "" },
    price: { type: String, maxlength: 100, trim: true, default: "" },
    tutorName: { type: String, required: true, maxlength: 200, trim: true },
    tutorQualification: {
      type: String,
      maxlength: 500,
      trim: true,
      default: "",
    },
    phone: { type: String, maxlength: 20, trim: true, default: "" },
    whatsapp: { type: String, maxlength: 20, trim: true, default: "" },
    email: { type: String, maxlength: 200, trim: true, default: "" },
    ownerUserId: { type: String, maxlength: 60, trim: true, default: "" },
    ownerEmail: { type: String, maxlength: 220, trim: true, default: "" },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    contactClicks: { type: Number, default: 0 },

    // Legacy fields kept for backward compatibility
    className: { type: String, maxlength: 120, trim: true, default: "" },
    contact: { type: String, maxlength: 200, trim: true, default: "" },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

AdSchema.index({ status: 1, createdAt: -1 });
AdSchema.index({ subject: 1, grade: 1 });
AdSchema.index({ district: 1 });
AdSchema.index({ isFeatured: -1, createdAt: -1 });
AdSchema.index({
  title: "text",
  body: "text",
  subject: "text",
  tutorName: "text",
});

export const Ad = models.Ad ?? model("Ad", AdSchema);
