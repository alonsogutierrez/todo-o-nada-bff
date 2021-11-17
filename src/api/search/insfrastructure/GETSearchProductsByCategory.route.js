const HTTPCodes = require('http-status-codes');
const SearchProductsUseCases = require('../useCases/products');
const isValidQuery = require('../adapters/GETSearchProductsValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    logger.log('Begin Search by category finished');
    const { categoryName } = req.params;
    logger.log('Validating category query query: ', categoryName);
    if (!isValidQuery({ categoryName })) {
      res.status(HTTPCodes.BAD_REQUEST).send({
        error: 'Invalid params',
      });
      return;
    }
    logger.log('Begin to search category : ', categoryName);
    const searchProductsResponse =
      await SearchProductsUseCases.getProductsByCategory(
        categoryName,
        0 //TODO: Add number page params
      );
    logger.log('Request finished: ', searchProductsResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(searchProductsResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't search products by category: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/search/category/:categoryName',
  action,
};
