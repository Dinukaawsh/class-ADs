import { Schema, model, models } from "mongoose";

const InstituteSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 180, trim: true },
    slug: { type: String, required: true, unique: true, maxlength: 220, trim: true },
    logoUrl: { type: String, maxlength: 500, trim: true, default: "" },
    district: { type: String, required: true, maxlength: 80, trim: true },
    city: { type: String, maxlength: 120, trim: true, default: "" },
    branchLocations: [{ type: String, maxlength: 180, trim: true }],
    subjects: [{ type: String, maxlength: 120, trim: true }],
    description: { type: String, required: true, maxlength: 5000, trim: true },
    website: { type: String, maxlength: 500, trim: true, default: "" },
    phone: { type: String, maxlength: 30, trim: true, default: "" },
    whatsapp: { type: String, maxlength: 30, trim: true, default: "" },
    email: { type: String, maxlength: 220, trim: true, default: "" },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    reviewCount: { type: Number, min: 0, default: 0 },
    totalCourses: { type: Number, min: 0, default: 0 },
    grades: [{ type: String, maxlength: 80, trim: true }],
    schedules: [{ type: String, maxlength: 180, trim: true }],
    classModes: [{ type: String, enum: ["Online", "Physical", "Hybrid"] }],
    courses: [
      {
        title: { type: String, maxlength: 180, trim: true },
        subject: { type: String, maxlength: 120, trim: true },
        level: { type: String, maxlength: 120, trim: true },
        schedule: { type: String, maxlength: 180, trim: true },
        mode: { type: String, enum: ["Online", "Physical", "Hybrid"], default: "Physical" },
      },
    ],
    lecturers: [
      {
        name: { type: String, maxlength: 180, trim: true },
        qualification: { type: String, maxlength: 250, trim: true },
      },
    ],
    facilities: [{ type: String, maxlength: 200, trim: true }],
    galleryImages: [{ type: String, maxlength: 600, trim: true }],
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    views: { type: Number, default: 0 },
    inquiryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

InstituteSchema.index({ status: 1, isFeatured: -1, createdAt: -1 });
InstituteSchema.index({ district: 1, city: 1 });
InstituteSchema.index({ subjects: 1 });
InstituteSchema.index({ name: "text", description: "text", subjects: "text" });

export const Institute = models.Institute ?? model("Institute", InstituteSchema);
