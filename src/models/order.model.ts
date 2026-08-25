import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        images: [String],
      },
    ],

    paymentId: String,

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "pending",
    },
    trackingNumber: {
      type: String,
      index: true,
      // default: null
    },
    trackingUrl: {
      type: String,
      // default: null
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);