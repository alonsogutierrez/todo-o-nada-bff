const HTTPCodes = require('http-status-codes');
const GETBannersUseCases = require('./../../application/use_cases/getBanners');

const logger = console;

const action = async (req, res) => {
  try {
    const getBannersUseCases = new GETBannersUseCases();
    const getBannersResponse = await getBannersUseCases.getBanners();
    logger.log('Request finished: ', getBannersResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(getBannersResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't get banners: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/banners',
  action,
};
