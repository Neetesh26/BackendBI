import { Request, Response } from "express";
import stripe from "../config/stripeInstance";

interface ProductItem {
  id: string;
  name: string;
  // image: string;
  price: number;
}

interface CheckoutBody {
  product: ProductItem[];
}

export const createCheckoutSession = async (
  req: Request<{}, {}, CheckoutBody>,
  res: Response
) => {
  try {
    console.log("BODY:", req.body);

    const { product } = req.body;

    if (!product || !Array.isArray(product) || product.length === 0) {
      return res.status(400).json({ error: "Invalid product data" });
    }

    const line_items = product.map((item) => {
      const price = Number(item.price);

      if (isNaN(price)) {
        throw new Error(`Invalid price for ${item.name}`);
      }

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
            // // images: [item.image],
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `http://localhost:5173/orders/success`,
      cancel_url: `http://localhost:5173/orders/cancel`,
    });

    return res.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe Error:", error);

    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};