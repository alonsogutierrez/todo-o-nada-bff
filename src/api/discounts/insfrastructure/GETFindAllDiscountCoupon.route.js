const HTTPCodes = require('http-status-codes');
const DiscountCouponlUseCases = require('../useCases/discountCoupon');

const logger = console;

const action = async (req, res) => {
  try {
    const filters = {};
    const discountCouponListResponse = await DiscountCouponlUseCases.find();
    logger.log(
      'Request finished and get discount coupons response: ',
      discountCouponListResponse
    );
    res.status(HTTPCodes.StatusCodes.OK).send(discountCouponListResponse);
  } catch (err) {
    logger.error(`Can't get coupons response: ${err.message}`);
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't get coupons: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/discount-coupon',
  action,
};
