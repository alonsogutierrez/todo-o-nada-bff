const HTTPCodes = require('http-status-codes');
const SearchProductsUseCases = require('../useCases/products');
const isValidQuery = require('../adapters/GETSearchProductsValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const { categoryName } = req.params;
    logger.log('Validating query');
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
    res.status(HTTPCodes.OK).send(searchProductsResponse);
  } catch (err) {
    res.status(HTTPCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't search products by category: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/search/category/:categoryName',
  action,
};
