const HTTPCodes = require('http-status-codes');
const DiscountCouponUseCases = require('../useCases/discountCoupon');

const logger = console;

const action = async (req, res) => {
  try {
    const discountCouponResponse = await DiscountCouponUseCases.getAll();
    logger.log(
      'Request finished and get all discount coupon response: ',
      discountCouponResponse
    );
    res
      .status(HTTPCodes.StatusCodes.OK)
      .send({ discounts: discountCouponResponse });
  } catch (err) {
    logger.error(`Can't get all coupon response: ${err.message}`);
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't get all coupon: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/discount-coupon',
  action,
};
