const HTTPCodes = require('http-status-codes');
const DiscountCouponUseCases = require('../useCases/discountCoupon');

const isValidQuery = require('../adapters/GETDiscountCouponByCode.validator');

const logger = console;

const action = async (req, res) => {
  try {
    const { code } = req.params;
    logger.log('Validating query to get discount coupon: ', code);
    if (!isValidQuery({ code })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params to get discount coupon',
      });
      return;
    }
    const discountCouponResponse = await DiscountCouponUseCases.getByCode(code);
    logger.log(
      'Request finished and get discount coupon response: ',
      discountCouponResponse
    );
    res.status(HTTPCodes.StatusCodes.OK).send(discountCouponResponse);
  } catch (err) {
    logger.error(`Can't get coupon response: ${err.message}`);
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't get coupon: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/discount-coupon/:code',
  action,
};
