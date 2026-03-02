import { Request, Response } from "express";
import {
  // createCheckoutSession as createSessionService,
  createPaymentIntent as createIntentService,
  // handleStripeWebhook
} from "../services/paymentGateway.service";
import { HttpMessage } from "../constants";

// interface ProductItem {
//   id: string;
//   name: string;
//   // image: string;
//   price: number;
// }

// interface CheckoutBody {
//   product: ProductItem[];
//   userData?: any;
//   paymentMethodId?: string;
// }

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



// export const createCheckoutSession = async (
//   req: Request<{}, {}, CheckoutBody>,
//   res: Response
// ) => {
//   try {
//     const { product, userData } = req.body;
//     // console.log(req.body);

//     const session = await createSessionService(product, userData);
//     return res.json({ url: session.url });
//   } catch (error) {
//     return res.status(500).json({
//       error:
//         error instanceof Error ? error.message : HttpMessage.INTERNAL_SERVER_ERROR,
//     });
//   }
// };

// new endpoint used by the frontend when implementing the PaymentIntent flow
// export const createPaymentIntent = async (
//   req: Request<{}, {}, CheckoutBody>,
//   res: Response
// ) => {
//   // console.log(">>>>>>>>>r3q.vody",req.body);
//   // console.log(">>>>>>>>>r3q.vody",req.body);
  
//   try {
//     const { product, userData } = req.body;

//     // console.log(">>>>>>>", product)
//     // console.log(">>>>>>>",  userData)
//     const result = await createIntentService(product, userData);
//     // console.log(">>>>>>>successfullafter services", result)

//     if (result && !result.intent) {
//       return res.json({ customerId: result.customerId });
//     }

//     const { intent, customerId } = result as any;
//     return res.json({ clientSecret: intent.client_secret, customerId });
//   } catch (error) {
//     return res.status(500).json({
//       error:  
//         error instanceof Error ? error.message : HttpMessage.INTERNAL_SERVER_ERROR,
//     });
//   }
// };

// stripe will POST raw json to this route; middleware must use express.raw
// export const stripeWebhook = async (
//   req: Request,
//   res: Response
// ) => {
//   const signature = req.headers["stripe-signature"] as string;
//   try {
//     await handleStripeWebhook(signature, req.body as Buffer);
//     return res.status(200).send("ok");
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "unknown";
    // console.error("webhook error", message);
//     return res.status(400).send(`Webhook Error: ${message}`);
//   }
// };