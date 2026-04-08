import mongoose from "mongoose";
import { env } from "@/lib/env";

function getMongoUri(): string {
  return process.env.MONGODB_URI ?? env.MONGODB_URI;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (process.env.NODE_ENV !== "production") {
  global.mongooseCache = cache;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(getMongoUri(), {
      dbName: "classads1",
      bufferCommands: false,
    });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
