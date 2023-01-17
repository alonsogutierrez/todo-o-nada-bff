const HTTPCodes = require('http-status-codes');
const GETBannersUseCases = require('./../../application/use_cases/getBanners');

const logger = console;

const action = async (req, res) => {
  try {
    const { bannerNumber } = req.params;
    const getBannersUseCases = new GETBannersUseCases();
    const getBannerResponse = await getBannersUseCases.getByBannerNumber(
      bannerNumber
    );
    logger.log('Request finished: ', getBannerResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(getBannerResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't get banner by banner number: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/banners/:bannerNumber',
  action,
};
