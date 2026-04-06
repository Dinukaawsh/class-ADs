import mongoose from "mongoose";

import { env } from "@/lib/env";

declare global {
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached =
  global.mongooseConnection ??
  (global.mongooseConnection = {
    conn: null,
    promise: null,
  });

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      dbName: "classads1",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
