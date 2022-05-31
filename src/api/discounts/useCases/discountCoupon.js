const DiscountCouponRepository = require('./../insfrastructure/DiscountCouponRepository');

const logger = console;

const create = async (discountCoupon) => {
  try {
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
      err.message
    );
    throw new Error(err.message);
  }
};

const update = async (discountCoupon, discountFound) => {
  try {
    const { code } = discountFound;
    const discountUpdated = await DiscountCouponRespository.updateOne(
      {
        code: code,
      },
      discountCoupon
    );
    return discountUpdated;
  } catch (err) {
    logger.error(`Error trying to update discount use case: ${err.message}`);
    throw new Error(err.message);
  }
};

const process = async (discountCoupon) => {
  try {
    const { code } = discountCoupon;
    const discountFound = await DiscountCouponRespository.findOne({
      code: code,
    });

    if (discountFound && Object.keys(discountFound).length > 0) {
      return await update(discountCoupon, discountFound);
    }
    return await create(discountCoupon);
  } catch (err) {
    logger.error(`Error trying to process discount use case: ${err.message}`);
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
    const discountCouponResult = await DiscountCouponRespository.find();
    logger.log(
      'Discount all coupon well find in repository: ',
      discountCouponResult ? discountCouponResult : ''
    );
    return discountCouponResult;
  } catch (err) {
    logger.error(
      'Error when trying to all find discount coupon in repository: ',
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
