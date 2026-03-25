import { Request, Response } from "express";
import { generateGroqResponse, ChatMessage } from "../services/aiChatBot/grok.service";
import { ProductModel } from "../models/productSchema";
import OrderModel from "../models/order.model";

export const chatHandler = async (req: Request, res: Response) => {
  try {
    const { message, history = [] }: { message: string; history: ChatMessage[] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ reply: "Message is required ❌" });
    }

    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("under") || lowerMsg.includes("budget")) {
      const match = message.match(/\d+/);
      const budget = parseInt(match?.[0] || "0");

      if (budget === 0) {
        return res.json({
          type: "text",
          reply: "Please mention a budget amount. Example: products under ₹500",
        });
      }

      const products = await ProductModel.find({ price: { $lte: budget } })
        .select("name price images")
        .limit(5)
        .lean();

      if (!products.length) {
        return res.json({
          type: "text",
          reply: `😔 No products found under ₹${budget}`,
        });
      }

      return res.json({ type: "products", data: products });
    }

    // 📦 Order tracking
    if (lowerMsg.includes("track") || lowerMsg.includes("order status")) {
      const words = message.trim().split(" ");
      const trackingId = words[words.length - 1];

      const order = await OrderModel.findOne({ trackingNumber: trackingId });

      if (!order) {
        return res.json({
          type: "text",
          reply: `❌ No order found with ID: ${trackingId}. Please check your tracking number.`,
        });
      }

      return res.json({
        type: "text",
        reply: `📦 Order ${trackingId} Status: ${order.status}`,
      });
    }

    // 👕 Category filter
    const categoryMap: Record<string, string> = {
      men: "Men",
      women: "Women",
      shoes: "Shoes",
      kids: "Kids",
      accessories: "Accessories",
    };

    for (const keyword of Object.keys(categoryMap)) {
      if (lowerMsg.includes(keyword)) {
        const category = categoryMap[keyword];

        const products = await ProductModel.find({ category })
          .select("name price images")
          .limit(5)
          .lean();

        if (!products.length) {
          return res.json({
            type: "text",
            reply: `😔 No products found in ${category} category.`,
          });
        }

        return res.json({ type: "products", data: products });
      }
    }

    // 🤖 Groq AI fallback — with history
    const products = await ProductModel.find()
      .select("name price category")
      .limit(15)
      .lean();

    const aiReply = await generateGroqResponse(message, products, history);

    return res.json({ type: "text", reply: aiReply });

  } catch (error) {
    console.error("Chat Error:", error);
    return res.status(500).json({ type: "text", reply: "Server error ❌" });
  }
};