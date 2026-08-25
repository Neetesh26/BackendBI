import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendOrderMail = async (
  email: string,
  orderId: string,
  products: any[]
) => {

  const productHTML = products
    .map(
      (p: any) =>
        `<li>${p.name} - ₹${p.price}</li>`
    )
    .join("");

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Order Confirmation",
    html: `
      <h2>Order Confirmed 🎉</h2>

      <p>Your order has been placed successfully.</p>

      <p><b>Order ID:</b> ${orderId}</p>

      <h3>Products</h3>

      <ul>
        ${productHTML}
      </ul>

      <p>Thank you for shopping with us ❤️</p>
    `
  });
};