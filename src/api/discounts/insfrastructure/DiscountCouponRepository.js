const DiscountCoupon = require('../../../db/models/discount');

const logger = console;

const save = async (discountCouponData) => {
  try {
    const discountCoupon = new DiscountCoupon(discountCouponData);
    return await discountCoupon.save();
  } catch (err) {
    throw new Error(`Can't save discount coupon in repository: ${err.message}`);
  }
};

const find = async () => {
  try {
    const discountCoupon = await DiscountCoupon.find();
    if (discountCoupon) {
      return discountCoupon;
    }
    throw new Error('discount coupon not exist');
  } catch (err) {
    logger.error(`Can't find discount coupon in repository: ${err.message}`);
    throw new Error(`Can't find discount coupon in repository: ${err.message}`);
  }
};

const findOne = async (filters) => {
  try {
    const discountCoupon = await DiscountCoupon.findOne(filters);
    if (discountCoupon) {
      return discountCoupon.toJSON();
    }
    return {};
  } catch (err) {
    logger.error(`Can't find discount coupon in repository: ${err.message}`);
    throw new Error(`Can't find discount coupon in repository: ${err.message}`);
  }
};

const updateOne = async (filters, newData) => {
  try {
    const discountCoupon = await DiscountCoupon.updateOne(filters, newData);
    return discountCoupon;
  } catch (err) {
    throw new Error(`Can't find discount coupon in repository: ${err.message}`);
  }
};

module.exports = { save, find, findOne, updateOne };
