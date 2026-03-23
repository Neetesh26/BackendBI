import Order from "../models/order.model";
import User from "../models/usersSchema";
import { sendOrderMail } from "./sendOrderMail.service";
import { createShipmentService } from "./shipment.service";

export const createOrderService = async (orderData: any) => {

  const { userId, products, paymentId, status } = orderData;

  const formattedProducts = products.map((item: any) => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    images: item.images || []
  }));

  const order = await Order.create({
    userId,
    products: formattedProducts,
    paymentId,
    status
  });

  // SEND EMAIL
  try {

    const user = await User.findById(userId);

    if (user?.email) {
      await sendOrderMail(
        user.email,
        order._id.toString(),
        formattedProducts
      );
    }

  } catch (mailError) {

    console.error("Email failed but order created:", mailError);

  }

  // CREATE SHIPMENT
  try {

    const shipment = await createShipmentService();
    console.log(">>>>>>>",shipment);
    

    const trackingNumber = shipment.objectId;

    order.trackingNumber = trackingNumber;

    await order.save();

  } catch (shipmentError) {

    console.error("Shipment failed but order created:", shipmentError);

  }

  return order;
};

export const getOrdersByUserService = async (userId: string) => {

  const orders = await Order.find({ userId }).sort({ createdAt: -1 });

  return orders;
};