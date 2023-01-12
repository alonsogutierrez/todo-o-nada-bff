const HTTPCodes = require('http-status-codes');
const CreateBannerUseCase = require('../../application/use_cases/createBanner');
const isValidQuery = require('../../adapters/POSTCreateBannerValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const { body } = req;
    logger.log('Validating query to create banner');
    if (!isValidQuery({ body })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params',
      });
      return;
    }
    logger.log('Begining to create banner', body);
    const createBannerUseCase = new CreateBannerUseCase();
    const createBannerResponse = await createBannerUseCase.create(body);
    logger.log('Request finished: ', createBannerResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(createBannerResponse);
  } catch (err) {
    const message = `Can't create banner: ${err.message}`;
    logger.error(message);
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: message,
    });
  }
};

module.exports = {
  method: 'POST',
  route: '/banners',
  action,
};
