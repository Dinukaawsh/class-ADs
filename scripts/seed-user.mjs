import nextEnv from "@next/env";
import mongoose from "mongoose";
import argon2 from "argon2";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;
const email = process.env.USER_SEED_EMAIL?.trim().toLowerCase();
const password = process.env.USER_SEED_PASSWORD;
const name = process.env.USER_SEED_NAME?.trim() || "Test User";

if (!uri) {
  throw new Error("Missing MONGODB_URI");
}
if (!email || !password) {
  throw new Error("Missing USER_SEED_EMAIL or USER_SEED_PASSWORD");
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 220,
    },
    passwordHash: { type: String, required: true, maxlength: 500 },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

await mongoose.connect(uri);

const passwordHash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 19 * 1024,
  timeCost: 2,
  parallelism: 1,
});

await User.findOneAndUpdate(
  { email },
  {
    $set: { name, email, passwordHash, isEmailVerified: true },
  },
  { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
);

console.log(`User seeded for ${email}`);
await mongoose.disconnect();
