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
    const { bannerNumber } = req.params;
    logger.log('Begining to edit banner', bannerNumber);
    const filters = {
      bannerNumber,
    };
    const { locationArray } = req.imagesS3Service;
    const editBanner = {
      ...req.body,
      isActive: req.body.isActive.toLowerCase() === 'true' ? true : false,
      images: {
        desktop: locationArray[0] ? locationArray[0] : '',
        mobile: locationArray.length == 2 ? locationArray[1] : '',
      },
    };
    const editBannerUseCase = new EditBannerUseCase();
    const editBannerResponse = await editBannerUseCase.edit(
      filters,
      editBanner
    );
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
  route: '/banners/:bannerNumber',
  action,
};
