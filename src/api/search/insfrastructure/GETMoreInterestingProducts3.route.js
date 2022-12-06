const HTTPCodes = require('http-status-codes');

const SearchProductsUseCases = require('../useCases/products');
const { interestingProductsConfig } = require('../../../cron/jobs');

const logger = console;

const action = async (req, res) => {
  try {
    logger.log('Begining to get more interesting products 3');
    let moreInterestingProductsResponse = [];
    const interestingProductsFromCache = interestingProductsConfig['third'];
    if (!interestingProductsFromCache) {
      logger.info('Cache invalid to get more interesting products 3');
      moreInterestingProductsResponse =
        await SearchProductsUseCases.getMoreInterestingProducts(0, 10, 'third');
    } else {
      logger.info('Cache valid to get more interesting products 3');
      moreInterestingProductsResponse = interestingProductsFromCache;
    }
    logger.log('Request finished: ', moreInterestingProductsResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(moreInterestingProductsResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't search more interesting products 3: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/search/interesting-products-3',
  action,
};
