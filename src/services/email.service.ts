import { getEnv } from "../config/env";
import { Resend } from "resend";

const resend = new Resend(getEnv("RESEND_API_KEY"));

const sendOTPEmail = async (email: string, otp: string) => {
  try {
    console.log("resend working");
    
    const { data, error } = await resend.emails.send({
      from: getEnv("RESEND_MAIL"), // verified sender email in Resend
      to: [email],
      subject: "Your OTP Code",
      html: `
        <h2>Login OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    });

    if (error) {
      console.error("Resend Email Error:", error);
      return false;
    }

    console.log("Email sent:", data);
    return true;
  } catch (error) {
    console.error("Email service error:", error);
    return false;
  }
};

export default { sendOTPEmail };


// import nodemailer from "nodemailer";
// import SMTPTransport from "nodemailer/lib/smtp-transport";
// import dns from "dns";
// import { getEnv } from "../config/env";

// dns.setDefaultResultOrder("ipv4first");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: getEnv("MAIL_USER"),
//     pass: getEnv("MAIL_PASS"),
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
//   connectionTimeout: 20000,
//   greetingTimeout: 10000,
//   socketTimeout: 20000,
// } as SMTPTransport.Options);

// // Verify SMTP connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("SMTP Connection Error:", error);
//   } else {
//     console.log("SMTP Server Ready:", success);
//   }
// });

// const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
//   try {
//     console.log("Sending OTP email...");

//     const info = await transporter.sendMail({
//       from: `"Auth Service" <${getEnv("MAIL_USER")}>`,
//       to: email,
//       subject: "Your OTP Code",
//       html: `
//         <h2>Login OTP</h2>
//         <p>Your OTP is:</p>
//         <h1>${otp}</h1>
//         <p>This OTP will expire in 5 minutes.</p>
//       `,
//     });

//     console.log("Email sent:", info.messageId);
//     return true;
//   } catch (error) {
//     console.error("Email error:", error);
//     return false;
//   }
// };

// export default { sendOTPEmail };