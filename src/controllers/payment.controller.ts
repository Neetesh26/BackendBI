import { Request, Response } from "express";
import {
  createPaymentIntent as createIntentService,
} from "../services/paymentGateway.service";
import { HttpMessage } from "../constants";



export const  createPaymentIntent = async (
  req: Request<{}, {}>,
  res: Response
): Promise<Response> => {
  try {
    const { product, userData, paymentMethodId } = req.body;

    const result = await createIntentService(
      product,
      userData,
      paymentMethodId
    );

    const { intent, customerId } = result as any;

    return res.status(200).json({
      clientSecret: intent.client_secret,
      customerId,
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : HttpMessage.INTERNAL_SERVER_ERROR,
    });
  }
};
