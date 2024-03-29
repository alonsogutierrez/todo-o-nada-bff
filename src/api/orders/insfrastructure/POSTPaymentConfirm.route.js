const HTTPCodes = require('http-status-codes');
const CreateOrderPaymentUseCases = require('../useCases/orders');
const isValidQuery = require('../adapters/POSTPaymentConfirmRequestValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const token = req.body.token;
    logger.info('Validating query: ', token);
    if (!isValidQuery({ token })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params',
      });
      return;
    }
    logger.log('Begining to get payment status');
    const confirmPaymentStatusResponse =
      await CreateOrderPaymentUseCases.confirmOrderPayment(token);
    logger.log('Request finished: ', confirmPaymentStatusResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(confirmPaymentStatusResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't confirm payment status: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'POST',
  route: '/orders/payment_confirm',
  action,
};
