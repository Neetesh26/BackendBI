import { HttpMessage, HttpStatus } from "../constants";
import NotFoundHandler from "../errors/NotFoundHandler";
import { findByCondition } from "../repository/users.repository";
import { generateOTP } from "../shared/helper";
import twillioService from "./twillio.service";
import { createProductDataInDB } from "../repository/product.repository";
import Order from "../models/order.model";
import redis from "./redisIo.service";
import mailUpdateService from "./orderUpdate.service";
import { ProductModel } from "../models/productSchema";


export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered";


export const adminLoginServices = async (phone: string) => {

  const user = await findByCondition({ phone });

  if (!user || user.role !== "admin") {
    throw new NotFoundHandler(
      HttpMessage.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }

  const otp = generateOTP();

  user.isverified = false;
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const successfullySendOtp = await twillioService.sendOTP(phone, otp);

  if (!successfullySendOtp) {
    throw new NotFoundHandler(
      "Failed to send OTP",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  await user.save();

  return user;
};

export const createProducts = async (data: any) => {

  const product = await createProductDataInDB(data);
  
  if (!product) {
    throw new NotFoundHandler(
      HttpMessage.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
  // clear product cache
  try {
  await redis.del("products");
} catch (error) {
  console.log("Redis cache clear error:", error);
}

  return product;
};


export const getAllOrdersService = async () => {

  const orders = await Order.find()
    .populate("userId", "email")
    .sort({ createdAt: -1 });

  return orders;
};



export const updateOrderStatusService = async (
  orderId: string,
  status: OrderStatus
) => {

  const order = await Order.findById(orderId).populate("userId", "email");

  if (!order) {
    throw new NotFoundHandler("Order not found", 404);
  }

  const validStatus: OrderStatus[] = [
    "pending",
    "paid",
    "shipped",
    "delivered"
  ];

  if (!validStatus.includes(status)) {
    throw new NotFoundHandler(
      "Invalid order status",
      HttpStatus.BAD_REQUEST
    );
  }

  order.status = status;

  await order.save();

 try {
  const userEmail = (order.userId as any).email;

  if (userEmail) {
    await mailUpdateService.sendOrderStatusMail(
      userEmail,
      status,
      order._id.toString()
    );
  }
 } catch (error) {
  console.log("update product status email not working:", error);
 }

  return order;

};

export const deleteProductService = async (productId: string) => {

  const product = await ProductModel.findById(productId);

  if (!product) {
    throw new NotFoundHandler(
      "Product not found",
      HttpStatus.NOT_FOUND
    );
  }

  await ProductModel.findByIdAndDelete(productId);

  try {
  await redis.del("products");
} catch (error) {
  console.log("Redis cache clear error:", error);
}

  return product;

};