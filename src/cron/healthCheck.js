const RemoteRestData = require('./../api/shared/infrastructure/RemoteRESTData');

const logger = console;

const healthCheck = async () => {
  try {
    logger.info('Beginh Health check response');
    const healthResponse = await RemoteRestData.GETRequest(
      process.env.BASE_URL_BFF,
      '/health'
    );
    logger.info('Health check response: ', healthResponse);
    return healthResponse;
  } catch (err) {
    logger.error('Health check error: ', err.message);
    throw new Error(`Health check error: ${err.message}`);
  }
};

module.exports = healthCheck;
