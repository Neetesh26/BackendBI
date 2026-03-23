import express from 'express';
import { swaggerSetup } from "./config/swagger";
import { requestLoggerGlobal } from './middleware/requestLogger';
import authRouter from './routes/users.route';
import healthRouter from './routes/health.route'
import adminRouter from "./routes/admin.route";
import paymentRoute from "./routes/payment.route";

import cors from 'cors';
import compression from "compression";


import passport from "./config/passport";
import googleRouter from "./routes/users.route";
import orderRoutes from "./routes/order.routes";
import profileRoutes from "./routes/profile.routes";


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
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));


  app.use(passport.initialize());
  // New Google OAuth routes
  // app.set("trust proxy", true);
  //for reduce response time
  app.use(compression());

  app.use('/api/v1/health', healthRouter)

  app.use('/api/v1/auth', authRouter)
  app.use("/api/v1/auth", googleRouter);
  app.use('/api/v1/admin', adminRouter);
  app.use('/api/v1/products', require('./routes/products.routes').default);
  app.use("/api/payment", paymentRoute);
  app.use("/api/orders", orderRoutes);



  app.use("/api/v1/profile", profileRoutes);


  return app;
};
