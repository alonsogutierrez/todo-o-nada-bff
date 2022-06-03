const RemoteRestData = require('../../shared/infrastructure/RemoteRESTData');

const PAYMENT_API_BASE_URL = process.env.FLOW_API_BASE_URL;
const createPaymentRoute = '/payment/create';
const getPaymentStatusRoute = '/payment/getStatus';

const logger = console;

const createPayment = async (paymentData) => {
  try {
    const createPaymentResponse = await RemoteRestData.POSTRequest(
      PAYMENT_API_BASE_URL,
      createPaymentRoute,
      {},
      paymentData
    );
    return createPaymentResponse;
  } catch (err) {
    logger.error(`Can´t create payment in API: ${err.message}`);
    throw new Error(`${err.message}`);
  }
};

const getPaymentStatus = async (apiKey, token, s) => {
  try {
    const getPaymentStatusResponse = await RemoteRestData.GETRequest(
      PAYMENT_API_BASE_URL,
      getPaymentStatusRoute,
      { apiKey, token, s },
      {}
    );
    return getPaymentStatusResponse;
  } catch (err) {
    throw new Error(`Can´t get status payment in API: ${err.message} `);
  }
};

module.exports = { createPayment, getPaymentStatus };
