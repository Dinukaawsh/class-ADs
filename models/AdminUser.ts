import { Schema, model, models } from "mongoose";

const AdminUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
    },
    passwordHash: {
      type: String,
      required: true,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

AdminUserSchema.index({ email: 1 }, { unique: true });

export const AdminUser = models.AdminUser ?? model("AdminUser", AdminUserSchema);
