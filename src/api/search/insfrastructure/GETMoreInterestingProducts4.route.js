const HTTPCodes = require('http-status-codes');

const SearchProductsUseCases = require('../useCases/products');

const logger = console;

const action = async (req, res) => {
  try {
    logger.log('Begining to get more interesting products 4');
    let moreInterestingProductsResponse = [];
    const interestingProductsFromCache = interestingProductsConfig['four'];
    if (!interestingProductsFromCache) {
      logger.info('Cache invalid to get more interesting products 4');
      moreInterestingProductsResponse =
        await SearchProductsUseCases.getMoreInterestingProducts(0, 6, 'four');
    } else {
      logger.info('Cache valid to get more interesting products 4');
      moreInterestingProductsResponse = interestingProductsFromCache;
    }
    logger.log('Request finished: ', moreInterestingProductsResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(moreInterestingProductsResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't search more interesting products 4: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/search/interesting-products-4',
  action,
};
