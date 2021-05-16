const HTTPCodes = require('http-status-codes');
const CreateOrderPaymentUseCases = require('../useCases/orders');
const isValidQuery = require('../adapters/POSTPaymentConfirmRequestValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    console.log('req.body: ', req.body);
    console.log('req.headers: ', req.headers);
    const token = req.headers['x-request-id'];
    console.log('token: ', token);
    logger.info('Validating query: ', token);
    if (!isValidQuery({ token })) {
      res.status(HTTPCodes.BAD_REQUEST).send({
        error: 'Invalid params'
      });
      return;
    }
    logger.log('Begining to get payment status');
    const confirmPaymentStatusResponse = await CreateOrderPaymentUseCases.confirmOrderPayment(
      token
    );
    logger.log('Request finished: ', confirmPaymentStatusResponse);
    res.status(HTTPCodes.OK).send(confirmPaymentStatusResponse);
  } catch (err) {
    res.status(HTTPCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't confirm payment status: ${err.message}`
    });
  }
};

module.exports = {
  method: 'POST',
  route: '/orders/payment_confirm',
  action
};
