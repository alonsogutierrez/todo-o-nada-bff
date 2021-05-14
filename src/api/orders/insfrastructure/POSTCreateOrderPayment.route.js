const HTTPCodes = require('http-status-codes');
const CreateOrderPaymentUseCases = require('../useCases/orders');
const isValidQuery = require('../adapters/POSTCreateOrderPaymentRequestValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const { body } = req;
    logger.log('Validating query');
    if (!isValidQuery({ body })) {
      res.status(HTTPCodes.BAD_REQUEST).send({
        error: 'Invalid params'
      });
      return;
    }
    logger.log('Begining to create order payment');
    const createOrderPaymentResponse = await CreateOrderPaymentUseCases.createOrderPayment(
      body
    );
    logger.log('Request finished: ', createOrderPaymentResponse);
    res.status(HTTPCodes.OK).send(createOrderPaymentResponse);
  } catch (err) {
    res.status(HTTPCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't create order payment: ${err.message}`
    });
  }
};

module.exports = {
  method: 'POST',
  route: '/orders',
  action
};
