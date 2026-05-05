import { Schema, model, models } from "mongoose";

const EmailOtpSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    purpose: {
      type: String,
      enum: ["verify_account", "delete_ad"],
      required: true,
    },
    codeHash: { type: String, required: true },
    adId: { type: String, default: "" },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

EmailOtpSchema.index({ email: 1, purpose: 1, createdAt: -1 });

export const EmailOtp = models.EmailOtp ?? model("EmailOtp", EmailOtpSchema);
//ggg