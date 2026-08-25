import Redis from "ioredis";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT || 6379);

const redis = new Redis({
  host: redisHost,
  port: redisPort,
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD || undefined,
  lazyConnect: true,
});

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.warn("⚠️ Redis unavailable:", err.message);
});

export default redis;