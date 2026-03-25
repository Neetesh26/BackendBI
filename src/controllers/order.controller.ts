import { Request, Response } from "express";
import {
  createOrderService,
  getOrdersByUserService,
} from "../services/order.service";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    // console.log(">>>>>>>>>>>cont",req.body);
    // console.log("order api hit");
    
    const order = await createOrderService(req.body);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    // console.error(">>>>>>>>controllererr",error);

    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};

export const getUserOrdersController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const orders = await getOrdersByUserService(userId);
    
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};