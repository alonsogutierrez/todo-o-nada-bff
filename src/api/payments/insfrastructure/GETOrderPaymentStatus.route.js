const HTTPCodes = require('http-status-codes');
const GETOrderPaymentStatus = require('../useCases/payments');
const isValidQuery = require('../adapters/GETOrderPaymentStatusRequestValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const { query } = req.query;
    if (!isValidQuery({ query })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params',
      });
      return;
    }
    logger.log('Begining to get order payment status');
    const orderPaymentStatusResponse =
      await GETOrderPaymentStatus.getPaymentStatus(orderNumber);
    logger.log('Request finished: ', orderPaymentStatusResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(orderPaymentStatusResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't get order payment status: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/payments',
  action,
};
