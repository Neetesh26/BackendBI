// // import nodemailer from "nodemailer";
// import { getEnv } from "../config/env";



// // const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 587,
// //   secure: false, 
// //   tls: {
// //     rejectUnauthorized: false // Helps with Render's network
// //   },
// //   connectionTimeout: 10000,  // 10s timeout
// //   greetingTimeout: 5000,
// //   socketTimeout: 10000,
// //   auth: {
// //     user: getEnv("MAIL_USER"),
// //     pass: getEnv("MAIL_PASS"),
// //   },
// // });



// // const sendOTPEmail = async (email: string, otp: string) => {
// //   const mailOptions = {
// //     from: getEnv("MAIL_USER"),
// //     to: email,
// //     subject: "Your OTP Code",
// //     html: `
// //       <h2>Login OTP</h2>
// //       <p>Your OTP is:</p>
// //       <h1>${otp}</h1>
// //       <p>This OTP will expire in 5 minutes.</p>
// //     `,
// //   };

// //   try {
// //     await transporter.sendMail(mailOptions);
// //     return true;
// //   } catch (error) {
// //     console.error("Email error:", error);
// //     return false;
// //   }
// // };

// // export default { sendOTPEmail };

// import { Resend } from "resend";
// // import getEnv from "../utils/getEnv";

// const resend = new Resend(getEnv("RESEND_API_KEY"));

// const sendOTPEmail = async (email: string, otp: string) => {
//   try {
//     console.log("resend working");
    
//     const { data, error } = await resend.emails.send({
//       from: getEnv("RESEND_MAIL"), // verified sender email in Resend
//       to: [email],
//       subject: "Your OTP Code",
//       html: `
//         <h2>Login OTP</h2>
//         <p>Your OTP is:</p>
//         <h1>${otp}</h1>
//         <p>This OTP will expire in 5 minutes.</p>
//       `,
//     });

//     if (error) {
//       console.error("Resend Email Error:", error);
//       return false;
//     }

//     console.log("Email sent:", data);
//     return true;
//   } catch (error) {
//     console.error("Email service error:", error);
//     return false;
//   }
// };

// export default { sendOTPEmail };



import nodemailer from "nodemailer";
import { getEnv } from "../config/env";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // required for port 465
  auth: {
    user: getEnv("MAIL_USER"),
    pass: getEnv("MAIL_PASS"), // Google App Password
  },
});

// verify connection (helps debugging on deployment)
transporter.verify((error, _success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server Ready");
  }
});

const sendOTPEmail = async (email: string, otp: string) => {
  try {
    console.log("Sending OTP email...");

    const mailOptions = {
      from: `"Auth Service" <${getEnv("MAIL_USER")}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Login OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};

export default { sendOTPEmail };