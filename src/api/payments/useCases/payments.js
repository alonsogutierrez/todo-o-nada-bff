const CryptoJS = require('crypto-js');
const FormData = require('form-data');
const OrderRepository = require('./../../orders/insfrastructure/OrderRepository');
const RemoteRestData = require('../../shared/infrastructure/RemoteRESTData');

const PAYMENT_API_BASE_URL = process.env.FLOW_API_BASE_URL;
const FLOW_API_SECRET_KEY = process.env.FLOW_API_SECRET_KEY;
const FLOW_API_KEY = process.env.FLOW_API_KEY;
const BASE_URL_FE = process.env.BASE_URL_FE;
const BASE_URL_BFF = process.env.BASE_URL_BFF;

const createPaymentRoute = '/payment/create';
const getPaymentStatusRoute = '/payment/getStatusByFlowOrder';

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
    throw new Error(`Can´t create payment in API: ${err.message} `);
  }
};

const getPaymentStatus = async (orderNumber) => {
  try {
    const orderData = await OrderRepository.findOne({ orderNumber });
    logger.info('Verifying order data: ', orderData);
    if (orderData && Object.keys(orderData).length > 0) {
      const {
        paymentData: {
          apiResponse: { flowOrder },
        },
      } = orderData;
      const objectToSign = {
        apiKey: FLOW_API_KEY,
        flowOrder: flowOrder,
      };
      const signedMessage = signPaymentMessage(objectToSign);
      logger.info('Message well signed: ', orderNumber);
      const getPaymentStatusResponse = await RemoteRestData.GETRequest(
        PAYMENT_API_BASE_URL,
        getPaymentStatusRoute,
        {
          apiKey: FLOW_API_KEY,
          flowOrder: flowOrder,
          s: signedMessage,
        },
        {}
      );
      logger.info('getPaymentStatusResponse: ', getPaymentStatusResponse);
      const paymentStatus = {
        isValid: false,
      };
      const { status } = getPaymentStatusResponse;
      if (status && status === 2) {
        paymentStatus.isValid = true;
      }
      return paymentStatus;
    }
    throw new Error('Order not found');
  } catch (err) {
    throw new Error(`Can´t get status payment in API: ${err.message} `);
  }
};

const signPaymentMessage = (messageToSignData) => {
  let messageToSign = '';
  for (const key in messageToSignData) {
    messageToSign += key + messageToSignData[key];
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
