import passport from "../config/passport";
import asyncWrapper from "../middleware/asyncWrapper";
import { Request, Response } from "express";
import { sendOTPService, verifyOTPService } from "../services/auth.service";
import { HttpStatus } from "../constants";
import { generateToken } from "../shared/helper";
import { getEnv } from "../config/env";
  // import { generateToken } from "../shared/helper";
  // import { getEnv } from "../config/env";

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



// Start Google OAuth
export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

// Callback after Google login
export const googleAuthCallback = (req: Request, res: Response, next: any) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      // Failed login → redirect to frontend login page
      return res.redirect(`${getEnv("FRONTEND_URL")}/login`);
    }

    // Successful login → generate JWT token
    const token = generateToken({ id: user._id, email: user.email }, process.env.JWT_SECRET!);

    // Redirect to frontend with token in query params
    return res.redirect(
  `${getEnv("FRONTEND_URL")}/oAuth-success?email=${user.email}&id=${user._id}&token=${token}`
);
  })(req, res, next);
};