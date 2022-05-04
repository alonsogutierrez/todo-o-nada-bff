const mongoose = require('mongoose');

const discountCouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    isPercentual: {
      type: Boolean,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    expireDate: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DiscountCoupon = mongoose.model('DiscountCoupon', discountCouponSchema);

module.exports = DiscountCoupon;
