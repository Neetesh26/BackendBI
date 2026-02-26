import express  from 'express';
import authRouter from './routes/users.route';
import healthRouter from './routes/health.route'
import adminRouter from "./routes/admin.route";
import {swaggerSetup}  from "./config/swagger";
import { requestLoggerGlobal } from './middleware/requestLogger';
import paymentRoute from "./routes/payment.route";
import cors from 'cors';

export const createApp = () => {
  const app = express();
  // stripe requires the raw body for webhook signature verification; register
  // the middleware for that path before the generic json parser.
  app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(requestLoggerGlobal)
  swaggerSetup(app);

  app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  })); 
  app.use('/api/v1/health',healthRouter)

  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/admin', adminRouter);
  app.use("/api/payment", paymentRoute);

  return app;
};
