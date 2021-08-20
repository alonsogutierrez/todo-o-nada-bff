const HTTPCodes = require('http-status-codes');

const SearchAdminProductsUseCases = require('../useCases/products');

const logger = console;

const action = async (req, res) => {
  try {
    logger.log('Begining to get admin products');
    const adminProductsResponse =
      await SearchAdminProductsUseCases.getAdminProducts();
    logger.log('Request finished: ', adminProductsResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(adminProductsResponse);
  } catch (err) {
    logger.error(`Can't search admin products: ${err.message}`);
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't search admin products: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/search/admin-products',
  action,
};
