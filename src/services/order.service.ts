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

  // SEND EMAIL in background
  User.findById(userId)
    .then((user) => {
      if (user?.email) {
        sendOrderMail(
          user.email,
          order._id.toString(),
          formattedProducts
        ).catch((mailError) =>
          console.error("Email failed in background:", mailError)
        );
      }
    })
    .catch((err) =>
      console.error("Failed to find user for email in background:", err)
    );

  // CREATE SHIPMENT in background
  createShipmentService()
    .then(async (shipment) => {
      if (shipment && shipment.objectId) {
        const trackingNumber = shipment.objectId;
        await Order.findByIdAndUpdate(order._id, { trackingNumber });
        console.log(`Shipment created and order updated for order ID: ${order._id}`);
      }
    })
    .catch((shipmentError) => {
      console.error("Background shipment creation failed:", shipmentError);
    });

  return order;
};

export const getOrdersByUserService = async (userId: string) => {

  const orders = await Order.find({ userId }).sort({ createdAt: -1 });

  return orders;
};