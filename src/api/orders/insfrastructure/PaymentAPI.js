const RemoteRestData = require('../../shared/infrastructure/RemoteRESTData');

const PAYMENT_API_BASE_URL = process.env.FLOW_API_BASE_URL;
const createPaymentRoute = '/payment/create';

const createPayment = async paymentData => {
  try {
    const createPaymentResponse = await RemoteRestData.POSTRequest(
      PAYMENT_API_BASE_URL,
      createPaymentRoute,
      {},
      paymentData
    );
    return createPaymentResponse;
  } catch (err) {
    throw new Error(`Can´t create payment in API: ${err.message} `);
  }
};

module.exports = { createPayment };
