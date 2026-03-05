import { HttpMessage, HttpStatus } from "../constants";
import { errorIndex } from "../errors/errorIndex";
import { generateOTP, generateToken } from "../shared/helper";
import emailService from "./email.service";
import { getEnv } from "../shared/utils";
import { createUser, findByCondition } from "../repository/users.repository";
import logger from "../config/logger";

export const sendOTPService = async (email: string) => {
  logger.info(`OTP request for email: ${email}`);

  let user = await findByCondition({ email });

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await emailService.sendOTPEmail(email, otp);

  if (!user) {
    user = await createUser({
      email,
      otp,
      otpExpiry,
      isverified: false,
    });

    return { message: "User created. OTP sent." };
  }

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  user.isverified = false;

  await user.save();

  return { message: "OTP Sent Successfully", user };
};

export const verifyOTPService = async (email: string, enteredOTP: string) => {
  const user = await findByCondition({ email });

  if (!user) {
    throw new errorIndex.NotFoundHandler(HttpMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  if (user.otp !== enteredOTP) {
    throw new errorIndex.BadRequestException(HttpMessage.NOT_FOUND, HttpStatus.BAD_REQUEST);
  }

  if (!user.otpExpiry || user.otpExpiry < new Date()) {
    throw new errorIndex.BadRequestException("OTP expired", HttpStatus.BAD_REQUEST);
  }

  user.isverified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;

  const token = generateToken({ id: user._id, email: user.email }, getEnv("JWT_SECRET"));

  user.token = token;
  await user.save();

  return { user, token };
};