const HTTPCodes = require('http-status-codes');
const GETOrdersUseCases = require('../useCases/orders');
const isValidQuery = require('../adapters/GETOrderByOrderNumberRequestValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    console.log(req.query);
    const query = req.query;
    logger.log('Validating query');
    if (!isValidQuery({ query })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params',
      });
      return;
    }
    console.log('query: ', query);
    const orderNumber = query.orderNumber;
    logger.log('Begining to get order by order number: ', orderNumber);
    const getOrderByOrderNumberResponse =
      await GETOrdersUseCases.getOrderByOrderNumber(orderNumber);
    logger.log('Request finished: ', getOrderByOrderNumberResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(getOrderByOrderNumberResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't get order by order number: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/orders/id',
  action,
};
