const HTTPCodes = require('http-status-codes');
const CarrouselsUseCases = require('../useCases/carrousels');

const isValidQuery = require('../adapters/POSTCreateCarrousels.validator');

const logger = console;

const action = async (req, res) => {
  try {
    const carrouselsData = req.body;
    logger.log('Validating query to create carrousels: ', carrouselsData);
    if (!isValidQuery({ carrouselsData })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params to create carrousels',
      });
      return;
    }
    const carrouselsProcessResponse = await CarrouselsUseCases.process(
      carrouselsData
    );
    logger.log(
      'Request finished and process carrousels response: ',
      carrouselsProcessResponse
    );
    res.status(HTTPCodes.StatusCodes.OK).send(carrouselsProcessResponse);
  } catch (err) {
    logger.error(`Can't create carrousels response: ${err.message}`);
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't create carrousels: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'POST',
  route: '/carrousels',
  action,
};
