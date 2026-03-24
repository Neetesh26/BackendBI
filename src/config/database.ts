import mongoose, { Connection } from "mongoose";
import { DatabaseConfig } from "./env";

let connection: Connection | null = null;

export const connectDB = async (): Promise<Connection> => {
  try {
    await mongoose.connect(DatabaseConfig.MONGO_URI);

    connection = mongoose.connection;

    console.log("MongoDB connected successfully");
    console.log("MongoDB connected with : ", connection.host);

    connection.on("error", (err) => {
      console.error(" MongoDB connection error:", err);
    });

    return connection;
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    process.exit(1);
  }
};
