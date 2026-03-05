import asyncWrapper from "../middleware/asyncWrapper";
import { Request, Response } from "express";
import { sendOTPService, verifyOTPService } from "../services/auth.service";
import { HttpStatus } from "../constants";

export const sendOTPController = asyncWrapper(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const response = await sendOTPService(email);

    return res.status(HttpStatus.OK).json({
      message: response.message,
    });
  }
);

export const verifyOTPController = asyncWrapper(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const data = await verifyOTPService(email, otp);

    return res.status(HttpStatus.OK).json({
      message: "Login successful",
      data,
    });
  }
);