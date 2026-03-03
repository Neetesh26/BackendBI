import { Request, Response, NextFunction, RequestHandler } from "express";
import redis from "../services/redisIo.service";


interface BucketData {
  tokens: number;
  lastRefill: number;
}

export const tokenBucketLimiter = (
  capacity: number,
  refillRate: number
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = `token_bucket:${req.ip}`;
      const now = Date.now();

      const existingData: string | null = await redis.get(key);

      let tokens: number = capacity;
      let lastRefill: number = now;

      if (existingData) {
        const bucket: BucketData = JSON.parse(existingData);

        tokens = bucket.tokens;
        lastRefill = bucket.lastRefill;

        const secondsPassed: number = (now - lastRefill) / 1000;
        const tokensToAdd: number = Math.floor(
          secondsPassed * refillRate
        );

        tokens = Math.min(capacity, tokens + tokensToAdd);
        lastRefill = now;
      }

      if (tokens <= 0) {
        res.status(429).json({
          success: false,
          message: "Too many requests. Try again later.",
        });
        return;
      }

      tokens -= 1;

      // TTL calculation
      const ttlSeconds: number =
        Math.ceil(capacity / refillRate) * 2;

      await redis.set(
        key,
        JSON.stringify({ tokens, lastRefill }),
        {
          EX: ttlSeconds ,
        }as any
      );

      next();
    } catch (error) {
      console.error("Rate Limit Error:", error);
      next();
    }
  };
};