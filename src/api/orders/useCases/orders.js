const CryptoJS = require('crypto-js');
const FormData = require('form-data');

const PaymentAPI = require('../insfrastructure/PaymentAPI');
const OrderRepository = require('../insfrastructure/OrderRepository');
const ProductRepository = require('../insfrastructure/ProductRepository');

const idBuilder = require('../idBuilder');

const FLOW_API_SECRET_KEY = process.env.FLOW_API_SECRET_KEY;
const FLOW_API_KEY = process.env.FLOW_API_KEY;
const BASE_URL_FE = process.env.BASE_URL_FE;
const BASE_URL_BFF = process.env.BASE_URL_BFF;

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
    order = await generateOrderData(order);
    logger.info('Generating paymentData with orderData: ', order);
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
      order.paymentData.apiResponse = { token, url, flowOrder };
      logger.info('Payment well created in API: ', token, url, flowOrder);
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
    throw new Error(`Can't create order payment use cases: ${err.message}`);
  }
};

const confirmOrderPayment = async token => {
  logger.info('Begin to confirm order payment');
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
      logger.info('commerceOrder: ', commerceOrder);
      let orderPaid = await OrderRepository.findOne({
        orderNumber: commerceOrder
      });
      logger.info('Trying to update order: ', commerceOrder);
      if (!orderPaid) {
        return {
          code: 404,
          message: 'Order not found in repository'
        };
      }
      let { products } = orderPaid;
      products = await updateStockProducts(products);
      logger.info('Products well updated');
      const orderPaidUpdated = await updateOrderStatus(
        commerceOrder,
        products,
        orderPaid.paymentData,
        'paid'
      );
      logger.info('Order well updated: ', orderPaidUpdated);
      //TODO: Create logic when an order is paid (validate and confirm inventory, change order state to paid)
      return {
        orderPaidUpdated,
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

const updateStockProducts = async products => {
  const productsUpdated = await products.map(async product => {
    logger.info('product: ', product);
    const { itemNumber, sku, quantity } = product;
    let productInDB = await ProductRepository.findOne({
      itemNumber,
      details: {
        $elemMatch: {
          sku
        }
      }
    });
    logger.info('productInDB: ', productInDB);
    if (!productInDB) {
      return {
        code: 404,
        message: 'Product not found in repository'
      };
    }
    let { details } = productInDB;
    logger.info('Actual details: ', details);
    await ProductRepository.updateOne(
      {
        itemNumber,
        details: {
          $elemMatch: {
            sku
          }
        }
      },
      {
        details: details.map(detail => {
          if (detail.sku === sku) {
            logger.info('Updating sku stock');
            const newDetail = {
              ...detail,
              stock: parseInt(detail.stock, 10) - parseInt(quantity, 10)
            };
            logger.info('newDetail: ', newDetail);
            return newDetail;
          }
          return detail;
        })
      }
    );
    productInDBUpdated = await ProductRepository.findOne({
      itemNumber,
      details: {
        $elemMatch: {
          sku
        }
      }
    });
    logger.info('Product well updated: ', productInDBUpdated);
    return {
      ...productInDBUpdated,
      inventoryState: {
        state: 'confirmed'
      }
    };
    // TODO: Update elastic repository
  });
  return productsUpdated;
};

const updateOrderStatus = async (
  orderNumber,
  products,
  paymentData,
  status
) => {
  paymentData.state = status;
  return await OrderRepository.updateOne(
    {
      orderNumber
    },
    {
      paymentData,
      products
    }
  );
};

const generateOrderData = async order => {
  const orderNumber = await idBuilder.generateOrderId();
  order.orderNumber = orderNumber;
  let { paymentData, products } = order;
  const {
    user: {
      address: { city }
    }
  } = paymentData;
  let subTotal = 0;
  products.forEach(product => {
    subTotal +=
      parseInt(product.price.basePriceSales, 10) *
      parseInt(product.quantity, 10);
  });
  paymentData.state = 'created';
  paymentData.transaction = {
    date: new Date(),
    discount: 0,
    subTotal: subTotal,
    shipping: getShippingAmount(city)
  };
  order.paymentData = paymentData;
  order.products = products.map(product => {
    logger.log('Product from client: ', product);
    return {
      ...product,
      inventoryState: {
        state: 'Reserved'
      }
    };
  });
  return order;
};

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
    urlConfirmation: `${BASE_URL_BFF}/orders/payment_confirm`,
    urlReturn: `${BASE_URL_FE}?orderNumber=${order.orderNumber}`
  };
};

const signMessage = objectToSign => {
  let messageToSign = '';
  for (const key in objectToSign) {
    messageToSign += key + objectToSign[key];
  }
  const signedMessage = CryptoJS.HmacSHA256(
    messageToSign,
    FLOW_API_SECRET_KEY
  ).toString();
  logger.info('Signed message: ', signedMessage);
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
  const isValid = token && url && flowOrder ? true : false;
  return isValid;
};

// TODO: Mofify all regions ID
const getShippingAmount = region => {
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
      return -1000;
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
      throw new Error('Region unrecognized');
  }
};

module.exports = { createOrderPayment, confirmOrderPayment };
