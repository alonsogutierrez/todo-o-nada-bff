const HTTPCodes = require('http-status-codes');
const CarrouselsUseCases = require('../useCases/carrousels');

const logger = console;

const action = async (req, res) => {
  try {
    const carrouselsFindOneResponse = await CarrouselsUseCases.findOne();
    logger.log(
      'Request finished and get carrousels response: ',
      carrouselsFindOneResponse
    );
    res.status(HTTPCodes.StatusCodes.OK).send(carrouselsFindOneResponse);
  } catch (err) {
    logger.error(`Can't get carrousels response: ${err.message}`);
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't get carrousels: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/carrousels',
  action,
};
