const DiscountCouponRespository = require('./../insfrastructure/DiscountCouponRepository');

const logger = console;

const create = async (discountCoupon) => {
  try {
    console.log('discountCoupon: ', discountCoupon);
    const discountCouponResult = await DiscountCouponRespository.save(
      discountCoupon
    );
    logger.log(
      'Discount coupon well saved in repository: ',
      discountCouponResult
    );
    return { discountCouponResult };
  } catch (err) {
    logger.error(
      'Error when trying to save discount coupon in repository: ',
      discountCouponResult
    );
    throw new Error(err.message);
  }
};

module.exports = { create };
