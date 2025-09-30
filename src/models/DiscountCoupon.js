const mongoose = require("mongoose");

const DiscountCouponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: false,
    Unique: true,
  },

  active: {
    type: Boolean,
    required: true,
    default: false,
  },

  // type of discount flat or percentage
  type: {
    type: String,
    required: true,
    default: "flat",
  },

  amount: {
    type: Number,
    required: true,
    default: 0,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = DiscountCoupon = mongoose.model("DiscountCoupon", DiscountCouponSchema);
