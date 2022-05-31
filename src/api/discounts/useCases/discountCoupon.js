const DiscountCouponRepository = require('./../insfrastructure/DiscountCouponRepository');

const logger = console;

const create = async (discountCoupon) => {
  try {
    console.log('discountCoupon: ', discountCoupon);
    const discountCouponResult = await DiscountCouponRepository.save(
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
    const discountCouponResult = await DiscountCouponRepository.findOne({
      code: couponCode,
    });
    logger.log('Discount coupon get from repository: ', discountCouponResult);
    if (discountCouponResult && Object.keys(discountCouponResult).length > 0) {
      const { amount, code, isActive, isPercentual, expireDate } =
        discountCouponResult;
      const isValidCouponByDate = Date.now() <= new Date(expireDate).getTime();
      const isValid = isActive && isValidCouponByDate;
      const couponByCode = {
        amount,
        code,
        isActive,
        isPercentual,
        isValid,
        expireDate,
      };
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

const find = async () => {
  try {
    const discountCouponList = await DiscountCouponRepository.find();
    return discountCouponList;
  } catch (err) {
    logger.error(
      'Error when trying to get discounts coupon in repository: ',
      err.message
    );
    return [];
  }
};

const updateOne = async (code, discountCouponData) => {
  try {
    if (discountCouponData.isPercentual) {
      if (discountCouponData.amount <= 0 && discountCouponData.amount > 99) {
        logger.error(
          'Discount coupon amount percentual invalid: ',
          discountCouponData.amount
        );
        const noUpdated = {};
        return noUpdated;
      }
    }
    const discountCouponUpdated = await DiscountCouponRepository.updateOne(
      { code },
      discountCouponData
    );
    return discountCouponUpdated;
  } catch (err) {
    logger.error(
      'Error when trying to update discount coupon in repository: ',
      err.message
    );
    return {};
  }
};

module.exports = { create, getByCode, find, updateOne };
