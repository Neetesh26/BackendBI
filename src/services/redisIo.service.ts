import Redis from "ioredis";
import dotenv from "dotenv";
import { getEnv } from "../config/env";

dotenv.config();

const redis = new Redis({
  host: getEnv("REDIS_HOST"),
  port: parseInt(getEnv("REDIS_PORT")),
  username: "default",
  password: getEnv("REDIS_PASSWORD"),
});

redis.on("connect", () => {
  console.log("✅ Redis Cloud Connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

export default redis;