function required(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  MONGODB_URI: required("MONGODB_URI", "mongodb://127.0.0.1:27017/classads1"),
  JWT_SECRET: required("JWT_SECRET", "dev_change_this_secret"),
  ADMIN_EMAIL: required("ADMIN_EMAIL", "admin@classads.local"),
  ADMIN_PASSWORD: required("ADMIN_PASSWORD", "admin12345"),
};
