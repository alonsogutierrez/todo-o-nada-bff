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

const getByCode = async (couponCode) => {
  try {
    const discountCouponResult = await DiscountCouponRespository.findOne({
      code: couponCode,
    });
    logger.log('Discount coupon get from repository: ', discountCouponResult);
    const { amount, code, isActive, isPercentual } = discountCouponResult;
    const couponByCode = { amount, code, isActive, isPercentual };
    return couponByCode;
  } catch (err) {
    logger.error(
      'Error when trying to get discount coupon in repository: ',
      err.message
    );
    throw new Error(err.message);
  }
};

module.exports = { create, getByCode };
