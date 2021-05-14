const CryptoJS = require('crypto-js');
const FormData = require('form-data');

const PaymentAPI = require('../insfrastructure/PaymentAPI');
const OrderRepository = require('../insfrastructure/OrderRepository');
const ProductRepository = require('../insfrastructure/ProductRepository');

const idBuilder = require('../idBuilder');

const FLOW_API_SECRET_KEY = process.env.FLOW_API_SECRET_KEY;
const FLOW_API_KEY = process.env.FLOW_API_KEY;
const BASE_URL_FE = process.env.BASE_URL_FE
const BASE_URL_BFF = process.env.BASE_URL_BFF

const STATUS_PAYMENT_RESPONSE = {
  PAYMENT_PENDING: 1,
  PAYED: 2,
  REJECTED: 3,
  CANCELED: 4
};

const logger = console;

const createOrderPayment = async order => {
  try {
    logger.info('Creating order payment', order);
    order = generateOrderData(order);
    logger.info('Generating paymentData');
    const paymentData = generatePaymentData(order);
    logger.info('Signing payment message');
    const signedPaymentMessage = signMessage(paymentData);
    logger.info('Payment message well signed');
    const paymentFormData = generatePaymentFormData(
      paymentData,
      signedPaymentMessage
    );
    logger.info('Trying to create payment in api');
    const paymentCreationResponse = await PaymentAPI.createPayment(
      paymentFormData
    );

    logger.info('Trying to validate payment api response');
    if (isValidPaymentResponse(paymentCreationResponse)) {
      const { token, url, flowOrder } = paymentCreationResponse;
      order.paymentData.apiResponse = { token, url, flowOrder }
      logger.info('Payment well created in API');
      const orderData = await OrderRepository.save(order);
      logger.info('Order well saved in repository');
      const createOrderPaymentResponse = {
        redirect_to: `${url}?token=${token}`,
        flowOrder,
        orderData
      };
      return createOrderPaymentResponse;
    }
    const { code, message } = paymentCreationResponse;
    if (code && message) {
      return { code, message };
    } else {
      throw new Error(
        `Error in payment api responsse: ${JSON.stringify(
          paymentCreationResponse
        )}`
      );
    }
  } catch (err) {
    throw new Error(`Can't create order payment use cases: `, err.message);
  }
};

const confirmOrderPayment = async token => {
  const objectToSign = {
    apiKey: FLOW_API_KEY,
    token
  };
  const signedMessage = signMessage(objectToSign);
  const paymentStatusResponse = await PaymentAPI.getPaymentStatus(
    FLOW_API_KEY,
    token,
    signedMessage
  );
  const { status, commerceOrder } = paymentStatusResponse;
  switch (status) {
    case STATUS_PAYMENT_RESPONSE['PAYED']:
      console.log('commerceOrder: ', commerceOrder);
      let paidOrder = await OrderRepository.findOne({
        orderNumber: commerceOrder
      })
      if (!paidOrder) {
        return {
          code: 404,
          message: 'Order not found in repository'
        }
      }
      let { products } = paidOrder
      products = products.map(async (product) => {
        const { itemNumber, sku, quantity } = product
        const productInDB = await ProductRepository.findOne({
          itemNumber,
          details: {
            $elemMatch: {
              sku
            }
          }
        });
        if (!productInDB) {
          return {
            code: 404,
            message: 'Product not found in repository'
          }
        }
        const { details } = productInDB
        details = details.map((detail) => {
          return {
            ...detail,
            stock: detail.stock - quantity
          }
        })
        await ProductRepository.updateOne({
          itemNumber,
          details: {
            $elemMatch: {
              sku
            }
          }
        }, {
          details
        });
        return {
          ...product,
          inventoryState: {
            state: 'confirmed'
          }
        }
        // TODO: Update elastic repository
      });
      paidOrder = await OrderRepository.updateOne({
          orderNumber: commerceOrder
        },
        {
          status: 'paid',
          products
        });
      console.log('paidOrder: ', paidOrder)
      //TODO: Create logic when an order is paid (validate and confirm inventory, change order state to paid)
      return {
        paidOrder,
        message: 'Order well updated'
      };

    case STATUS_PAYMENT_RESPONSE['PAYMENT_PENDING']:
      //TODO: Create logic when an order is payment pending (maintain same order)
      return 0;

    case STATUS_PAYMENT_RESPONSE['REJECTED']:
      //TODO: Create logic when an order is payment rejected (unreserve inventory, throw 500 status response)
      return 0;

    case STATUS_PAYMENT_RESPONSE['CANCELED']:
      //TODO: Create logic when an order is payment rejected (unreserve inventory, throw 500 status response)
      return 0;
    default:
      throw new Error('Unrecognized payment status');
  }
};

const generateOrderData = (order) => {
    const orderNumber = await idBuilder.generateOrderId();
    order.orderNumber = orderNumber;
    let { paymentData, products } = order;
    const { user: { address: { city } } } = paymentData
    paymentData.state = 'created';
    paymentData.transaction = {
      date: new Date(),
      discount: 0,
      subTotal: products.reduce((accum, product) => {
        return accum + parseInt(product.price.BasePriceSales, 10) * parseInt(product.quantity, 10)
      }, 0),
      shipping: getShippingAmount(city)
    };
    order.paymentData = paymentData
    products = products.map(product => {
      product.inventoryState = {
        state: 'Reserved'
      };
    });
    order.products = products
    return order
}

const generatePaymentData = order => {
  const { paymentData } = order;
  const {
    transaction: { subTotal, shipping },
    user: { email }
  } = paymentData;
  // NOTE: All fields must be order alphabetically in asc way
  return {
    amount: subTotal + shipping,
    apiKey: FLOW_API_KEY,
    commerceOrder: `${order.orderNumber}`,
    currency: 'CLP',
    email,
    payment_currency: 'CLP',
    subject: 'Creando pago para Todo o Nada Tatto Art',
    urlConfirmation:
      `${BASE_URL_BFF}/orders/payment_confirm`,
    urlReturn: `${BASE_URL_FE}`
  };
};

const signMessage = objectToSign => {
  const messageToSign = '';
  for (const key in objectToSign) {
    messageToSign += key + objectToSign[key];
  }
  const signedMessage = CryptoJS.HmacSHA256(
    messageToSign,
    FLOW_API_SECRET_KEY
  ).toString();
  return signedMessage;
};

const generatePaymentFormData = (paymentData, signPaymentMessage) => {
  const {
    amount,
    apiKey,
    commerceOrder,
    currency,
    email,
    payment_currency,
    subject,
    urlConfirmation,
    urlReturn
  } = paymentData;
  const paymentFormData = new FormData();

  paymentFormData.append('amount', amount);
  paymentFormData.append('apiKey', apiKey);
  paymentFormData.append('commerceOrder', commerceOrder);
  paymentFormData.append('currency', currency);
  paymentFormData.append('email', email);
  paymentFormData.append('payment_currency', payment_currency);
  paymentFormData.append('subject', subject);
  paymentFormData.append('urlConfirmation', urlConfirmation);
  paymentFormData.append('urlReturn', urlReturn);
  paymentFormData.append('s', signPaymentMessage);

  return paymentFormData;
};

const isValidPaymentResponse = paymentResponse => {
  const { token, url, flowOrder } = paymentResponse;
  const isValid = token && url && flowOrder;
  return isValid;
};

// TODO: Mofify all regions ID
const getShippingAmount = (region) => {
  switch (region) {
    case 'I':
      return 12000;
    case 'II':
      return 11000;
    case 'III':
      return 10000;
    case 'IV':
      return 9000;
    case 'Región Metropolitana de Santiago':
      return 5000;
    case 'VI':
      return 5000;
    case 'VII':
      return 7000;
    case 'VII':
      return 8000;
    case 'VII':
      return 10000;
    case 'VII':
      return 12000;
    case 'VII':
      return 15000;
    default:
      throw new Error('Region unrecognized')
  }
}

module.exports = { createOrderPayment, confirmOrderPayment };
