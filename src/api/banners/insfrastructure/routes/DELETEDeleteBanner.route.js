const HTTPCodes = require('http-status-codes');
const EraseBannerUseCase = require('../../application/use_cases/eraseBanner');
const isValidQuery = require('../../adapters/DELETEDeleteBannerValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const { body } = req;
    logger.log('Validating query to erase banner');
    if (!isValidQuery({ body })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params',
      });
      return;
    }
    logger.log('Begining to erase banner', body);
    const eraseBannerUseCase = new EraseBannerUseCase();
    const eraseBannerResponse = await eraseBannerUseCase.erase(body);
    logger.log('Request finished: ', eraseBannerResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(eraseBannerResponse);
  } catch (err) {
    const message = `Can't erase banner: ${err.message}`;
    logger.error(message);
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: message,
    });
  }
};

module.exports = {
  method: 'DELETE',
  route: '/banners',
  action,
};
