const HTTPCodes = require('http-status-codes');
const SearchProductsUseCases = require('../useCases/products');
const isValidQuery = require('../adapters/GETSearchProductsValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const { query } = req.query;
    logger.log('Validating query');
    if (!isValidQuery({ query })) {
      res.status(HTTPCodes.BAD_REQUEST).send({
        error: 'Invalid params',
      });
      return;
    }
    logger.log('Begining to search product');
    const searchProductsResponse = await SearchProductsUseCases.getProducts(
      query,
      0 //TODO: Add number page params
    );
    logger.log('Request finished: ', searchProductsResponse);
    res.status(HTTPCodes.OK).send(searchProductsResponse);
  } catch (err) {
    logger.error(`Can't search products: ${err.message}`);
    res.status(HTTPCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't search products: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/search',
  action,
};
