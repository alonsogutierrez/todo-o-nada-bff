const CryptoJS = require('crypto-js');
const FormData = require('form-data');
const { nanoid } = require('nanoid');

const ElasticSearchRestData = require('../../shared/infrastructure/ElasticSearchRESTData');
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
  CANCELED: 4,
};

const logger = console;

const createOrderPayment = async (order) => {
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
        orderData,
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

const confirmOrderPayment = async (token) => {
  logger.info(`Begin to confirm order payment with token: ${token}`);
  const objectToSign = {
    apiKey: FLOW_API_KEY,
    token,
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
        orderNumber: commerceOrder,
      });
      logger.info('Trying to update order: ', commerceOrder);
      if (!orderPaid) {
        return {
          code: 404,
          message: 'Order not found in repository',
        };
      }
      let { products } = orderPaid;
      products = await updateStockProducts(products);
      logger.info('Products well updated: ', products);
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
        message: 'Order well updated',
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

const updateProduct = async (itemNumber, sku, quantity) => {
  try {
    logger.info(
      `Trying to get product from product repository: itemNumber ${itemNumber} & SKU ${sku}`
    );
    let productInDB = await ProductRepository.findOne({
      itemNumber,
      details: {
        $elemMatch: {
          sku,
        },
      },
    });
    logger.info(`Productfound in DB => ${itemNumber} & SKU ${sku}`);
    if (!productInDB) {
      logger.info(
        `Product is not found in product repository: itemNumber ${itemNumber} & SKU ${sku}`
      );
      return {
        code: 404,
        message: 'Product not found in repository',
      };
    }
    logger.info(`Begin Promise All to update products for sku ${sku}`);
    const promisesReponses = Promise.all([
      updateProductRepository(productInDB, sku, quantity),
      updateSearchProductRepository(itemNumber, sku, quantity),
    ]);
    logger.info(
      `End Promise All to update products for sku ${sku}: ${JSON.stringify(
        promisesReponses
      )}`
    );
    const productDetailsUpdated = {
      ...product,
      inventoryState: {
        state: 'confirmed',
      },
    };
    logger.info('Product details updated: ', productDetailsUpdated);
    return productDetailsUpdated;
  } catch (err) {
    throw new Error(`Error update product: ${err.message}`);
  }
};

const getUpdateProductsPromises = (products) => {
  return products.map(async (product) => {
    try {
      const { itemNumber, sku, quantity } = product;
      const productUpdated = await updateProduct(itemNumber, sku, quantity);
      logger.log('productUpdated: ', productUpdated);
      return productUpdated;
    } catch (err) {
      throw new Error(
        `Error updating product in getUpdateProductsPromises: ${err.message}`
      );
    }
  });
};

const updateStockProducts = async (products) => {
  try {
    const productsUpdatesPromises = getUpdateProductsPromises(products);
    logger.info('productsUpdatesPromises: ', productsUpdatesPromises);

    const productsUpdated = Promise.all(productsUpdatesPromises);
    logger.log('updateStockProducts => productsUpdated: ', productsUpdated);
    return productsUpdated;
  } catch (err) {
    throw new Error(`Fail in updateStockProducts: ${err.message}`);
  }
};

const updateProductRepository = async (productInDB, sku, quantity) => {
  try {
    const { details: productDetails, itemNumber } = productInDB;
    const newProductDetails = productDetails.map((productDetail) => {
      logger.info(
        `Trying to update product in product repository: itemNumber ${itemNumber} & SKU ${productDetail.sku}`
      );
      if (productDetail.sku === sku) {
        productDetail.stock =
          parseInt(productDetail.stock, 10) - parseInt(quantity, 10);
        return productDetail;
      }
      return productDetail;
    });
    return await ProductRepository.updateOne(
      {
        itemNumber,
        details: {
          $elemMatch: {
            sku,
          },
        },
      },
      {
        details: newProductDetails,
      }
    );
  } catch (err) {
    throw new Error(`Error in update product repository: ${err.message}`);
  }
};

const updateSearchProductRepository = async (itemNumber, sku, quantity) => {
  try {
    logger.info(
      `Trying to update product in search product repository: itemNumber ${itemNumber} & SKU ${sku}`
    );
    const query = {
      bool: {
        must: [
          {
            match: {
              itemNumber: itemNumber,
            },
          },
          {
            match: {
              sku: sku,
            },
          },
        ],
      },
    };
    const productFound = await ElasticSearchRestData.SearchRequest('products', {
      query,
    });
    logger.info(
      `Product found in elastic repository: itemNumber ${itemNumber} & SKU ${sku}`
    );
    const { hits } = productFound;
    const productNotFoundResponse = {
      code: 404,
      message: 'Product not found in search repository',
    };
    if (hits && Object.keys(hits).length > 0) {
      logger.info(
        'Product found in search repository',
        itemNumber,
        sku,
        productFound
      );
      const { total } = hits;
      logger.info('Total hits: ', total);
      if (total > 0) {
        const finalHits = hits.hits;
        const actualProduct = finalHits[0]._source;
        logger.info('Actual product data: ', actualProduct);
        const newProductData = {
          ...actualProduct,
          quantity:
            parseInt(actualProduct.quantity, 10) - parseInt(quantity, 10),
        };
        const updateRequestData = await ElasticSearchRestData.UpdateRequest(
          'products',
          finalHits[0]._id,
          newProductData
        );
        logger.info('Product updated in elastic repository: ', newProductData);
        return updateRequestData;
      }
    }
    return productNotFoundResponse;
  } catch (err) {
    throw new Error(
      `Error trying in updateSearchProductRepository: ${err.message}`
    );
  }
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
      orderNumber,
    },
    {
      paymentData,
      products,
    }
  );
};

const generateOrderData = async (order) => {
  const orderNumber = await idBuilder.generateOrderId();
  order.orderNumber = orderNumber;
  let { paymentData, products } = order;
  let subTotal = 0;
  products.forEach((product) => {
    subTotal +=
      parseInt(product.price.basePriceSales, 10) *
      parseInt(product.quantity, 10);
  });
  paymentData.state = 'created';
  paymentData.transaction = {
    date: new Date(),
    discount: 0,
    subTotal: subTotal,
    shipping: 0,
  };
  order.uuid = nanoid();
  order.paymentData = paymentData;
  order.products = products.map((product) => {
    logger.log('Product from client: ', product);
    const reservedProduct = {
      ...product,
      inventoryState: {
        state: 'Reserved',
      },
    };
    logger.log('reservedProduct: ', reservedProduct);
    return reservedProduct;
  });
  return order;
};

const generatePaymentData = (order) => {
  const { paymentData, uuid } = order;
  const {
    transaction: { subTotal, shipping },
    user: { email },
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
    urlReturn: `${BASE_URL_FE}?orderNumber=${order.orderNumber}&id=${uuid}`,
  };
};

const signMessage = (objectToSign) => {
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
    urlReturn,
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

const isValidPaymentResponse = (paymentResponse) => {
  const { token, url, flowOrder } = paymentResponse;
  const isValid = token && url && flowOrder ? true : false;
  return isValid;
};

module.exports = { createOrderPayment, confirmOrderPayment };
