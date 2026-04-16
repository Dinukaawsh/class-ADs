import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  // Kept as runtime error path so development can start
  // without crashing imports in unrelated pages.
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function uploadClassImageToCloudinary(params: {
  bytes: Buffer;
  filenameBase: string;
  format: "png" | "webp";
}): Promise<string> {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are missing.");
  }

  const dataUri = `data:image/${params.format};base64,${params.bytes.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "classads/classes",
    public_id: `${Date.now()}-${params.filenameBase || "class"}`,
    resource_type: "image",
    overwrite: false,
  });

  return result.secure_url;
}
