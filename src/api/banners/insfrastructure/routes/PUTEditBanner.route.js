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

    let editBanner = {
      ...req.body,
      isActive: req.body.isActive.toLowerCase() === 'true' ? true : false,
    };
    const { locationArray } = req.imagesS3Service;

    if (locationArray.length > 0) {
      editBanner.images = {};
      editBanner.images.desktop = locationArray[0];
      editBanner.images.mobile = locationArray[0];
      if (locationArray.length > 1) {
        editBanner.images.mobile = locationArray[1];
      }
    } else {
      if (editBanner.images.length > 0) {
        const imagesBannersUrlList = editBanner.images;
        editBanner.images = {};
        editBanner.images.desktop = imagesBannersUrlList[0];
        editBanner.images.mobile = imagesBannersUrlList[0];
        if (imagesBannersUrlList.length > 1) {
          editBanner.images.mobile = imagesBannersUrlList[1];
        }
      }
    }
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
