const HTTPCodes = require('http-status-codes');
const DiscountCouponlUseCases = require('../useCases/discountCoupon');

const isValidQuery = require('../adapters/GETDiscountByCode.validator');

const logger = console;

const action = async (req, res) => {
  try {
    const couponCode = req.params.couponCode;
    logger.log('Validating query to get discount coupon by code: ', couponCode);
    if (!isValidQuery({ code: couponCode })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params to get discount coupon by code',
      });
      return;
    }
    const discountCouponByCodeResponse =
      await DiscountCouponlUseCases.getByCode(couponCode);
    logger.log(
      'Request finished and get discount coupon by code response: ',
      discountCouponByCodeResponse
    );
    res.status(HTTPCodes.StatusCodes.OK).send(discountCouponByCodeResponse);
  } catch (err) {
    logger.error(`Can't get coupon by code response: ${err.message}`);
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't get coupon: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/discount-coupon/:couponCode',
  action,
};
