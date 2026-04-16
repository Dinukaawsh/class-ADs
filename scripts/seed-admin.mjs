import nextEnv from "@next/env";
import mongoose from "mongoose";
import argon2 from "argon2";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;
const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_SEED_PASSWORD;

if (!uri) {
  throw new Error("Missing MONGODB_URI");
}
if (!email || !password) {
  throw new Error("Missing ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD");
}

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

const AdminUser =
  mongoose.models.AdminUser ?? mongoose.model("AdminUser", AdminUserSchema);

await mongoose.connect(uri);

const passwordHash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 19 * 1024,
  timeCost: 2,
  parallelism: 1,
});

await AdminUser.findOneAndUpdate(
  { email },
  { $set: { email, passwordHash, isActive: true, role: "admin" } },
  { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
);

console.log(`Admin user seeded for ${email}`);
await mongoose.disconnect();
