import { stripe } from "../config/stripeInstance";
import { HttpMessage } from "../constants";
import { Card } from "../models/CardSchema";
import { findByCondition, updateById } from "../repository/users.repository";

const computeAmount = (product: any[]) => {
  return product.reduce((sum, item) => {
    const price = Number(item.price);

    if (isNaN(price)) {
      throw new Error(`Invalid price for ${item.name}`);
    }

    return sum + Math.round(price * 100);
  }, 0);
};

const resolveStripeCustomer = async (
  userData?: any
): Promise<string | undefined> => {

  if (!userData || !userData._id) {
    return undefined;
  }

  const user = await findByCondition({ _id: userData._id });

  if (!user) {
    return undefined;
  }

  // If customer already exists
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer with EMAIL instead of phone
  const customer = await stripe.customers.create({
    email: user.email || undefined,
    metadata: {
      userId: userData._id.toString(),
    },
  });

  await updateById(userData._id, {
    stripeCustomerId: customer.id,
  });

  return customer.id;
};

export const createPaymentIntent = async (
  product: any[],
  userData: any,
  paymentMethodId?: string
) => {

  if (!product || !Array.isArray(product) || product.length === 0) {
    throw new Error(HttpMessage.NOT_FOUND);
  }

  const amount = computeAmount(product);

  const customerId = await resolveStripeCustomer(userData);

  if (!customerId) {
    throw new Error("Stripe customer not found or could not be created");
  }

  // If first time payment (no card saved)
  if (!paymentMethodId) {
    return { customerId };
  }

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
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  const paymentMethod = await stripe.paymentMethods.retrieve(
    paymentMethodId
  );

  // Save card reference
  if (paymentMethod.card && userData?._id) {

    await Card.findOneAndUpdate(
      { userId: userData._id },
      {
        userId: userData._id,
        stripePaymentMethodId: paymentMethodId,
      },
      {
        upsert: true,
        new: true,
      }
    );

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

  return {
    intent,
    customerId,
  };
};