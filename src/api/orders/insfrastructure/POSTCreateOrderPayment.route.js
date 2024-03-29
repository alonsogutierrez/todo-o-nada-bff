const HTTPCodes = require('http-status-codes');
const CreateOrderPaymentUseCases = require('../useCases/orders');
const isValidQuery = require('../adapters/POSTCreateOrderPaymentRequestValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const { body } = req;
    logger.log('Validating query');
    if (!isValidQuery({ body })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params',
      });
      return;
    }
    logger.log('Begining to create order payment: ', body);
    const createOrderPaymentResponse =
      await CreateOrderPaymentUseCases.createOrderPayment(body);
    if (
      createOrderPaymentResponse &&
      Object.keys(createOrderPaymentResponse).length > 0 &&
      createOrderPaymentResponse.code &&
      createOrderPaymentResponse.code === 400
    ) {
      res
        .status(HTTPCodes.StatusCodes.BAD_REQUEST)
        .send(createOrderPaymentResponse);
    }
    logger.log('Request finished: ', createOrderPaymentResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(createOrderPaymentResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't create order payment: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'POST',
  route: '/orders',
  action,
};
