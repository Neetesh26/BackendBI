import nodemailer from "nodemailer";
import { getEnv } from "../config/env";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: getEnv("MAIL_USER"),
    pass: getEnv("MAIL_PASS"),
  },
});


const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: getEnv("MAIL_USER"),
    to: email,
    subject: "Your OTP Code",
    html: `
      <h2>Login OTP</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};

export default { sendOTPEmail };