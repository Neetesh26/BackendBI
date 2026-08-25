import mongoose, { Connection } from "mongoose";
import { DatabaseConfig } from "./env";

let connection: Connection | null = null;

const buildMongoUris = (): string[] => {
  const configuredUri = DatabaseConfig.MONGO_URI?.trim();

  const candidates = [
    "mongodb://127.0.0.1:27017/ecom",
    configuredUri,
  ].filter((uri): uri is string => Boolean(uri));

  return [...new Set(candidates)];
};

export const connectDB = async (): Promise<Connection> => {
  const mongoUris = buildMongoUris();
  let lastError: unknown;

  for (const uri of mongoUris) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });

      connection = mongoose.connection;

      console.log("MongoDB connected successfully");
      console.log("MongoDB connected with:", connection.host);

      connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });

      return connection;
    } catch (error) {
      lastError = error;
      console.warn(`MongoDB connection failed for ${uri}:`, error);
    }
  }

  console.error("MongoDB connection failed:", lastError);
  process.exit(1);
};
