const RemoteRestData = require('../api/shared/infrastructure/RemoteRESTData');
const {
  getMoreInterestingProducts,
} = require('../api/search/useCases/products');

const logger = console;

const interestingProductsConfig = {
  principal: [],
  second: [],
  third: [],
  four: [],
};

const initialLoad = async (type) => {
  getInterestingProducts();
};

const healthCheck = async () => {
  try {
    logger.info('Beging Health check response');
    const healthResponse = await RemoteRestData.GETRequest(
      process.env.BASE_URL_BFF,
      '/health'
    );
    logger.info('Health check response: ', healthResponse);
    return healthResponse;
  } catch (err) {
    logger.error('Health check error: ', err.message);
    throw new Error(`Health check error: ${err.message}`);
  }
};

const getInterestingProducts = async () => {
  try {
    logger.info('Begin to get interesting products to cache');
    const promisesResponses = new Array(4).fill(null);
    promisesResponses[0] = await getMoreInterestingProducts(0, 10, 'principal');
    promisesResponses[1] = await getMoreInterestingProducts(0, 10, 'second');
    promisesResponses[2] = await getMoreInterestingProducts(0, 10, 'third');
    promisesResponses[3] = await getMoreInterestingProducts(0, 10, 'four');

    logger.info('Promises Responses: ', promisesResponses);

    interestingProductsConfig['principal'] = promisesResponses[0];
    interestingProductsConfig['second'] = promisesResponses[1];
    interestingProductsConfig['third'] = promisesResponses[2];
    interestingProductsConfig['four'] = promisesResponses[3];

    return interestingProductsConfig;
  } catch (err) {
    logger.error('Cant get interesting products from cron: ', err.message);
  }
};

initialLoad();

module.exports = {
  healthCheck,
  getInterestingProducts,
  interestingProductsConfig,
};
