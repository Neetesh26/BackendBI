import { createApp } from './app';
import { connectDB } from './config/database';
import cacheInstance from './services/redisIo.service';
import { AppConfig } from './shared/utils';
import dotenv from 'dotenv';

dotenv.config();

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const app = createApp();
    
    cacheInstance.on("connect", () => {
      console.log("Connected to Redis cache");
    });

    cacheInstance.on("error", (err) => {
      console.log("Redis error:", err);
    });

    app.listen(AppConfig.PORT, () => {
      console.log(`✅ Server is running on port ${AppConfig.PORT}`);
      console.log(`🔧 Environment: ${AppConfig.NODE_ENV}`);
      console.log(`Redis is connected: ${cacheInstance.status === 'ready' ? 'Yes' : 'No'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
