const DiscountCouponRespository = require('./../insfrastructure/DiscountCouponRepository');

const logger = console;

const create = async (discountCoupon) => {
  try {
    let discountCouponResult = {};
    discountCouponResult = await DiscountCouponRespository.save(discountCoupon);
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

module.exports = { create, getByCode, getAll, process };
