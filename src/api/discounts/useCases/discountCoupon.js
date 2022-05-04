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

const getByCode = async (code) => {
  try {
    logger.log('Trying to find coupon in repository: ', code);
    const discountCouponResult = await DiscountCouponRespository.findOne({
      code,
    });
    logger.log(
      'Discount coupon well find in repository: ',
      discountCouponResult ? discountCouponResult : ''
    );
    return { discountCouponResult };
  } catch (err) {
    logger.error(
      'Error when trying to find discount coupon in repository: ',
      discountCouponResult
    );
    throw new Error(err.message);
  }
};

const getAll = async () => {
  try {
    logger.log('Trying to find all coupon in repository');
    const discountCouponResult = await DiscountCouponRespository.findOne({});
    logger.log(
      'Discount all coupon well find in repository: ',
      discountCouponResult ? discountCouponResult : ''
    );
    return { discountCouponResult };
  } catch (err) {
    logger.error(
      'Error when trying to all find discount coupon in repository: ',
      discountCouponResult
    );
    throw new Error(err.message);
  }
};

module.exports = { create, getByCode, getAll };
