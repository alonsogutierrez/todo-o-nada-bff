const HTTPCodes = require('http-status-codes');
const EditBannerUseCase = require('../../application/use_cases/editBanner');
const isValidQuery = require('../../adapters/PUTEditBannerValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const { body } = req;
    logger.log('Validating query to edit banner');
    if (!isValidQuery({ body })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params',
      });
      return;
    }
    logger.log('Begining to edit banner', body);
    const editBannerUseCase = new EditBannerUseCase();
    const editBannerResponse = await editBannerUseCase.edit(body);
    logger.log('Request finished: ', editBannerResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(editBannerResponse);
  } catch (err) {
    const message = `Can't edit banner: ${err.message}`;
    logger.error(message);
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: message,
    });
  }
};

module.exports = {
  method: 'PUT',
  route: '/banners',
  action,
};
