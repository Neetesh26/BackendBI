import asyncWrapper from "../middleware/asyncWrapper";
import { Request, Response } from "express";
import { sendOTPService, verifyOTPService } from "../services/auth.service";
import { HttpStatus } from "../constants";
import { log } from "console";

// export const signupUser = asyncWrapper(async (req: Request, res: Response) => {
//   const { phone } = req.body as { phone: string };

//   const user = await registerUser(phone);

//   return res.status(HttpStatus.CREATED).json({
//     message: HttpMessage.CREATED,
//     data: user,
//   });
// });

// export const verifyUserOTPController = asyncWrapper(
//   async (_req: Request, _res: Response) => {
    
//     console.log(_req.params);
    
//     const { phone } = _req.params;
//     console.log(phone);
    
//     const { otp } = _req.body as { otp: string };

//     const user = await verifyUserOTP(phone, otp);

//     return _res.status(HttpStatus.OK).json({
//       message: "OTP verified successfully",
//       data: user,
//     });
//   }
// );

// export const loginUserController = asyncWrapper(
//   async (req: Request, res: Response) => {

//     const { phone } = req.body;
//     // console.log("phone number",phone);
    
//     const data = await loginUser(phone);

//     return res.status(HttpStatus.OK).json({
//       message: "Login successful",
//       data
//     });
//   }
// );
export const sendOTPController = asyncWrapper(
  async (req: Request, res: Response) => {
    const { phone } = req.body;

    const response = await sendOTPService(phone);

    return res.status(HttpStatus.OK).json({
      message:response.message
    });
  }
);

export const verifyOTPController = asyncWrapper(
  async (req: Request, res: Response) => {
    const { phone, otp } = req.body;
    log("phone, otp-->",phone, otp);
    const data = await verifyOTPService(phone, otp);

    return res.status(HttpStatus.OK).json({
      message: "Login successful",
      data,
    });
  }
);
