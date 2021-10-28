const CryptoJS = require('crypto-js');
const FormData = require('form-data');
const RemoteRestData = require('../../shared/infrastructure/RemoteRESTData');

const PAYMENT_API_BASE_URL = process.env.FLOW_API_BASE_URL;
const FLOW_API_KEY = process.env.FLOW_API_KEY;

const createPaymentRoute = '/payment/create';
const getPaymentStatusRoute = '/payment/getStatus';

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
    throw new Error(`Can´t create payment in API: ${err.message} `);
  }
};

const getPaymentStatus = async (s) => {
  try {
    const orderNumber = '';
    const orderData = await RemoteRestData.GETRequest(
      ORDER_API_BASE_URL,
      getOrderByOrderNUmber,
      { orderNumber },
      {}
    );
    const {
      paymentData: {
        apiResponse: { token },
      },
    } = orderData;
    const objectToSign = {
      apiKey: FLOW_API_KEY,
      token,
    };
    const signedMessage = signMessage(objectToSign);
    const getPaymentStatusResponse = await RemoteRestData.GETRequest(
      PAYMENT_API_BASE_URL,
      getPaymentStatusRoute,
      { FLOW_API_KEY, token, s: signedMessage },
      {}
    );
    return getPaymentStatusResponse;
  } catch (err) {
    throw new Error(`Can´t get status payment in API: ${err.message} `);
  }
};

const signPaymentMessage = (messageToSign) => {
  let messageToSign = '';
  for (const key in messageToSign) {
    messageToSign += key + messageToSign[key];
  }
  const signedMessage = CryptoJS.HmacSHA256(
    messageToSign,
    FLOW_API_SECRET_KEY
  ).toString();
  logger.info('Signed message: ', signedMessage);
  return signedMessage;
};

const generatePaymentData = (order) => {
  const { paymentData, uuid } = order;
  const {
    transaction: { subTotal, shipping },
    user: { email },
  } = paymentData;
  const urlReturn = `${BASE_URL_FE}?orderNumber=${order.orderNumber}&id=${uuid}`;
  // NOTE: All fields must be order alphabetically in asc way
  return {
    amount: subTotal + shipping,
    apiKey: FLOW_API_KEY,
    commerceOrder: `${order.orderNumber}`,
    currency: 'CLP',
    email,
    payment_currency: 'CLP',
    subject: 'Creando pago para Todo o Nada Tatto Art',
    urlConfirmation: `${BASE_URL_BFF}/orders/payment_confirm`,
    urlReturn,
  };
};

module.exports = {
  createPayment,
  getPaymentStatus,
  signPaymentMessage,
  generatePaymentData,
};
