import { getEnv } from "../config/env";
import { stripe } from "../config/stripeInstance";
import { HttpMessage } from "../constants";
import { findByCondition, updateById } from "../repository/users.repository";
import Stripe from "stripe";

/**
 * Helper to calculate total amount (in smallest currency unit) from product list.
 */
const computeAmount = (product: any[]) => {
  return product.reduce((sum, item) => {
    const price = Number(item.price);
    if (isNaN(price)) {
      throw new Error(`Invalid price for ${item.name}`);
    }
    return sum + Math.round(price * 100);
  }, 0);
};

/**
 * Resolve Stripe Customer
 */
const resolveStripeCustomer = async (
  userData?: any
): Promise<string | undefined> => {
  if (!userData || !userData._id) {
    return undefined;
  }
  // console.log("Resolving Stripe customer for user:", userData._id);

  const user = await findByCondition({ _id: userData._id });
  if (!user) {
    return undefined;
  }
  // console.log("user in  db",user);
  
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    phone: user.phone || undefined,
    metadata: { userId: userData._id.toString() },
  });
  // console.log("Created new Stripe customer:", customer);
  // console.log("Created new Stripe customer:", customer.id);

  // Save Stripe customer ID to database (first time and repeat payments)
  await updateById(userData._id, { stripeCustomerId: customer.id });

  return customer.id;
};

/**
 * Create Checkout Session
 */
export const createCheckoutSession = async (
  product: any[],
  userData?: any
) => {
  if (!product || !Array.isArray(product) || product.length === 0) {
    throw new Error(HttpMessage.NOT_FOUND);
  }

  const line_items = product.map((item) => {
    const price = Number(item.price);
    if (isNaN(price)) {
      throw new Error(`Invalid price for ${item.name}`);
    }

    return {
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(price * 100),
      },
      quantity: 1,
    };
  });

  const customerId = await resolveStripeCustomer(userData);
  // console.log("customer id",customerId);
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    customer: customerId ?? undefined, // SAFE FIX
    success_url: getEnv("Payment_Success_URL"),
    cancel_url: getEnv("Payment_Cancel_URL"),
  });

  return session;
};

/**
 * Create Payment Intent
 */
export const createPaymentIntent = async (
  product: any[],
  userData: any,
  paymentMethodId?: string
) => {
  // console.log("inside services intent" , userData, product);
  
  if (!product || !Array.isArray(product) || product.length === 0) {
    throw new Error(HttpMessage.NOT_FOUND);
  }

  const amount = computeAmount(product);
  const customerId = await resolveStripeCustomer(userData);

  // 🔥 IMPORTANT FIX
  if (!customerId) {
    throw new Error("Stripe customer not found or could not be created");
  }

  if (!paymentMethodId) {
    return { customerId };
  }

  // Attach payment method
  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  } catch (err: any) {
    if (!/already_attached/.test(err.message)) {
      throw err;
    }
  }

  // Set default payment method
  await stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: paymentMethodId },
  });

  // Persist payment method
  if (userData?._id) {
    await updateById(userData._id, {
      stripePaymentMethodId: paymentMethodId,
    });
  }

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: "inr",
    customer: customerId,
    payment_method: paymentMethodId,
    metadata: {
      userId: userData?._id || "",
      products: JSON.stringify(product),
    },
    payment_method_types: ["card"],
  });

  return { intent, customerId };
};

/**
 * Stripe Webhook Handler
 */
export const handleStripeWebhook = async (
  signature: string,
  rawBody: Buffer
) => {
  const webhookSecret = getEnv("STRIPE_WEBHOOK_SECRET");
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      // console.log("PaymentIntent succeeded:", {
        paymentIntentId: intent.id,
        status: intent.status,
        userId: intent.metadata?.userId || null,
      });
      break;
    }

    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // console.log("Checkout session completed:", session.id);
      break;
    }

    default:
      // console.log(`Unhandled Stripe event type ${event.type}`);
  }

  return event;
};