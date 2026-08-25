import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },

    image: [{ type: String }],

    category: {
      type: String,
      enum: ["Men", "Women", "Kids", "Shoes"],
      required: true,
      index: true,
    },

    subCategory: {
      type: String,
      default: "General",
    },

    sizes: [{ type: String }],

    bestseller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("Product", productSchema);