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
    if (discountCouponResult && Object.keys(discountCouponResult).length > 0) {
      const { amount, code, isActive, isPercentual, expireDate } =
        discountCouponResult;
      const isValidCouponByDate = Date.now() <= new Date(expireDate).getTime();
      const isValid = isActive && isValidCouponByDate;
      const couponByCode = { amount, code, isActive, isPercentual, isValid };
      return couponByCode;
    }
    const couponNotExists = {};
    return couponNotExists;
  } catch (err) {
    logger.error(
      'Error when trying to get discount coupon in repository: ',
      err.message
    );
    throw new Error(err.message);
  }
};

module.exports = { create, getByCode };
