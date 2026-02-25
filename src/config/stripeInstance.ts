import Stripe from "stripe";
import { getEnv } from "./env";


if (!getEnv('STRIPE_SECRET_KEY')) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

export const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'), {
  apiVersion: "2026-01-28.clover", // use latest stable version
});

export default stripe;
