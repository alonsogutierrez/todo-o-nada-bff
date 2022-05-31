const HTTPCodes = require('http-status-codes');
const DiscountCouponlUseCases = require('../useCases/discountCoupon');

const isValidQuery = require('../adapters/POSTCreateDiscount.validator');

const logger = console;

const action = async (req, res) => {
  try {
    const discountCoupon = req.body;
    logger.log('Validating query to create discount coupon: ', discountCoupon);
    if (!isValidQuery({ discountCoupon })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params to create discount coupon',
      });
      return;
    }
    const discountCouponFindResponse = await DiscountCouponlUseCases.find(
      discountCoupon.code
    );
    if (
      !discountCouponFindResponse &&
      !Object.keys(discountCouponFindResponse).length > 0
    ) {
      const discountCouponResponse = await DiscountCouponlUseCases.create(
        discountCoupon
      );
      logger.log(
        'Request finished and create discount coupon response: ',
        discountCouponResponse
      );
      res.status(HTTPCodes.StatusCodes.OK).send(discountCouponResponse);
    }
    const discountCouponResponse = await DiscountCouponlUseCases.updateOne(
      discountCoupon.code,
      discountCoupon
    );
    if (
      discountCouponResponse &&
      Object.keys(discountCouponResponse).length === 0
    ) {
      throw new Error(`Cant update coupon code: ${discountCoupon.code}`);
    }
    logger.log(
      'Request finished and update discount coupon response: ',
      discountCouponResponse
    );
    res.status(HTTPCodes.StatusCodes.OK).send(discountCouponResponse);
  } catch (err) {
    logger.error(`Can't create coupon response: ${err.message}`);
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't create coupon: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'POST',
  route: '/discount-coupon',
  action,
};
