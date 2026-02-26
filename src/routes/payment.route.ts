import express from 'express';
import {
  createCheckoutSession,
  createPaymentIntent,
  // stripeWebhook,
} from '../controllers/payment.controller';

const router = express.Router();

// legacy checkout session - still works, accepts optional `userData`.
router.post('/create-checkout-session', createCheckoutSession);

// newer payment intent flow used by stripe.js on the frontend
router.post('/create-payment-intent', createPaymentIntent);

// webhook endpoint must receive raw body so we apply express.raw middleware
// router.post(
//   '/webhook',
//   express.raw({ type: 'application/json' }),
//   // stripeWebhook
// );

export default router;