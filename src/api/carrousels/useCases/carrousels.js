const CarrouselsRepository = require('./../infrastructure/CarrouselsRepository');

const logger = console;

const findOne = async () => {
  try {
    const carrouselsFindOneResponse = await CarrouselsRepository.findOne();
    return carrouselsFindOneResponse;
  } catch (err) {
    logger.error(`Error trying to find one carrousel use case: ${err.message}`);
    throw new Error(`Error trying to find one use case: ${err.message}`);
  }
};

const process = async (carrouselsData) => {
  try {
    const carrouselsSaveResponse = await CarrouselsRepository.save(
      carrouselsData
    );
    return carrouselsSaveResponse;
  } catch (err) {
    logger.error(`Error trying to save carrousel use case: ${err.message}`);
    throw new Error(`Error trying to save use case: ${err.message}`);
  }
};

module.exports = { findOne, process };
