import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type:String
  },

  isverified: {
    type: Boolean,
    default: false,
  },

  token: {
    type: String,
  },

  otp: {
    type: String,
  },

  otpExpiry: {
    type: Date,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  stripeCustomerId: {
    type: String,
  },

  stripePaymentMethodId: {
    type: String,
  },
});

export default mongoose.model("User", userSchema);