const HTTPCodes = require('http-status-codes');

const SearchProductsUseCases = require('../useCases/products');
const { interestingProductsConfig } = require('../../../cron/jobs');

const logger = console;

const action = async (req, res) => {
  try {
    logger.log('Begining to get more interesting products');
    let moreInterestingProductsResponse = [];
    const interestingProductsFromCache = interestingProductsConfig['principal'];
    if (!interestingProductsFromCache) {
      logger.info('Cache invalid to get more interesting products 1');
      moreInterestingProductsResponse =
        await SearchProductsUseCases.getMoreInterestingProducts();
    } else {
      logger.info('Cache valid to get more interesting products 1');
      moreInterestingProductsResponse = interestingProductsFromCache;
    }
    logger.log('Request finished: ', moreInterestingProductsResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(moreInterestingProductsResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't search more interesting products: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/search/interesting-products',
  action,
};
