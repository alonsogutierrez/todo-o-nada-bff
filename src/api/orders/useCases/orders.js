const CryptoJS = require('crypto-js');
const FormData = require('form-data');
const { nanoid } = require('nanoid');

const ElasticSearchRestData = require('../../shared/infrastructure/ElasticSearchRESTData');
const PaymentAPI = require('../insfrastructure/PaymentAPI');
const OrderRepository = require('../insfrastructure/OrderRepository');
const ProductRepository = require('../insfrastructure/ProductRepository');
const SendEmailUseCases = require('./../../emails/useCases/emails');

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

const getOrderByOrderNumber = async (orderNumber) => {
  try {
    const orderData = await OrderRepository.findOne({
      orderNumber,
    });
    return orderData;
  } catch (err) {
    logger.error('Cant found order  by orderNumber: ', err.message);
    throw new Error(`Cant found order by orderNumber: ${err.message}`);
  }
};

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
  try {
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
    logger.info('Payment status response: ', status);
    switch (status) {
      case STATUS_PAYMENT_RESPONSE['PAYED']:
        logger.info('Trying to update order: ', commerceOrder);
        let orderPaid = await OrderRepository.findOne({
          orderNumber: commerceOrder,
        });

        logger.info('Order to update: ', orderPaid);
        if (!orderPaid) {
          return {
            code: 404,
            message: 'Order not found in repository',
          };
        }
        const { products } = orderPaid;
        logger.info('Trying to update products stock');
        const updateProductStockResults = await updateStockProducts(products);
        logger.info(
          'Update stock products process well done: ',
          updateProductStockResults
        );
        const productsConfirmed = products.map((product) => {
          return {
            ...product,
            inventoryState: {
              status: 'Confirmed',
            },
          };
        });
        const orderPaidUpdated = await updateOrderStatus(
          commerceOrder,
          productsConfirmed,
          orderPaid.paymentData,
          'paid'
        );
        logger.info('Order well updated: ', orderPaidUpdated);

        //GET order updated
        orderPaid = await OrderRepository.findOne({
          orderNumber: commerceOrder,
        });

        //Call to EMAIL API to send payment confirm template
        await SendEmailUseCases.sendEmail(orderPaid);

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
  } catch (err) {
    throw new Error(`Error trying to confirm order: ${err.message}`);
  }
};

const updateProductInRepositories = async (itemNumber, sku, quantity) => {
  try {
    logger.info(`Begin updateProductInRepositories for sku ${sku}`);

    const updateProductRepositoryResponse = await updateProductRepository(
      itemNumber,
      sku,
      quantity
    );
    const updateSearchRepositoryResponse = await updateSearchProductRepository(
      itemNumber,
      sku,
      quantity
    );

    logger.info(`End updateProductInRepositories for sku ${sku}`);
    const productUpdateResume = {
      updateProductRepositoryResponse,
      updateSearchRepositoryResponse,
    };
    return productUpdateResume;
  } catch (err) {
    logger.error(`Error update product: ${err.message}`);
    throw new Error(`Error update product: ${err.message}`);
  }
};

const updateStockProducts = async (products) => {
  try {
    logger.info('Updating products stock in both repositories, promise all');
    const updateStockProductsResult = await Promise.all(
      products.map(async (product) => {
        try {
          const { itemNumber, sku, quantity } = product;
          logger.info('Updating product: ', product);
          const updateProductInRepositoriesResult =
            await updateProductInRepositories(itemNumber, sku, quantity);
          logger.info('Product updated: ', updateProductInRepositoriesResult);
          return updateProductInRepositoriesResult;
        } catch (err) {
          logger.error(
            `Error updating product in getUpdateProductsPromises: ${err.message}`
          );
          throw new Error(
            `Error updating product in getUpdateProductsPromises: ${err.message}`
          );
        }
      })
    );
    logger.info('End update products stock in both repositories, promise all');
    return updateStockProductsResult;
  } catch (err) {
    logger.error(`Fail in updateStockProducts: ${err.message}`);
    throw new Error(`Fail in updateStockProducts: ${err.message}`);
  }
};

const updateProductRepository = async (itemNumber, sku, quantity) => {
  try {
    let productInDB = await ProductRepository.findOne({
      itemNumber: itemNumber,
      details: {
        $elemMatch: {
          sku,
        },
      },
    });
    logger.info(`Product in DB Response:  ${JSON.stringify(productInDB)}`);
    if (!productInDB) {
      logger.info(
        `Product is not found in product repository: itemNumber ${itemNumber} & SKU ${sku}`
      );
      return {
        code: 404,
        message: 'Product not found in repository',
      };
    }
    const { details } = productInDB;
    const newProductDetails = details.map((detail) => {
      logger.info(
        `Trying to update product in product repository: itemNumber ${itemNumber} & SKU ${detail.sku}`
      );
      if (detail.sku === sku) {
        logger.info(`Stock actual quantity ${detail.stock}`);
        detail.stock = parseInt(detail.stock, 10) - parseInt(quantity, 10);
        logger.info(`Stock updated quantity ${detail.stock}`);
        return detail;
      }
      logger.info(`Stock not updated sku ${sku}`);
      return detail;
    });
    logger.info(
      `newProductDetails in updateProductRepository method: ${JSON.stringify(
        newProductDetails
      )}`
    );
    const productUpdatedResponse = await ProductRepository.updateOne(
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
    logger.info(
      `Product well updated in db repository: itemNumber ${itemNumber} & SKU ${sku} & productUpdatedResponse ${productUpdatedResponse}`
    );
    return productUpdatedResponse;
  } catch (err) {
    logger.error(`Error in update product repository: ${err.message}`);
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
    if (!hits && !Object.keys(hits).length > 0) {
      throw new Error(`Invalid hits`);
    }
    logger.info(
      'Product found in search repository',
      itemNumber,
      sku,
      productFound
    );
    const { total } = hits;
    logger.info('Total hits: ', total);
    if (!(total > 0)) {
      throw new Error(`Total is negative`);
    }
    const finalHits = hits.hits;
    const actualProduct = finalHits[0]._source;
    logger.info('Actual product data: ', actualProduct);
    let productDetailsUpdated = {};
    if (actualProduct.details[sku]) {
      const productDetailsToUpdate = actualProduct.details;
      productDetailsToUpdate[sku] = {
        quantity:
          parseInt(productDetailsToUpdate[sku].quantity, 10) -
          parseInt(quantity, 10),
        size: productDetailsToUpdate[sku].size,
      };
      productDetailsUpdated = productDetailsToUpdate;
    } else {
      const productDetailsToUpdate = actualProduct.details;
      productDetailsToUpdate[sku] = {
        quantity: parseInt(quantity, 10),
        size: productDetailsToUpdate[sku].size,
      };
      productDetailsUpdated = productDetailsToUpdate;
    }
    const newProductData = {
      ...actualProduct,
      details: productDetailsUpdated,
    };
    const updateResponse = await ElasticSearchRestData.UpdateRequest(
      'products',
      finalHits[0]._id,
      newProductData
    );
    logger.info(
      'Product well updated in elastic repository: ',
      newProductData,
      updateResponse
    );
    return updateResponse;
  } catch (err) {
    throw new Error(
      `Error trying in updateSearchProductRepository: ${err.message}`
    );
  }
};

const updateOrderStatus = async (
  orderNumber,
  productsUpdated,
  paymentData,
  status
) => {
  let paymentDataUpdated = paymentData;
  paymentDataUpdated.state = status;
  paymentData.state = status;
  return await OrderRepository.updateOne(
    {
      orderNumber,
    },
    {
      paymentData: paymentDataUpdated,
      products: productsUpdated,
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
  const productsUpdated = await Promise.all(
    products.map(async (product) => {
      logger.log('Product from client: ', product);
      const productFilter = {
        itemNumber: product.itemNumber,
      };
      try {
        const dbProduct = await ProductRepository.findOne(productFilter);
        if (Object.keys(dbProduct).length === 0) {
          throw new Error('Invalid product');
        }
        const detailProduct = dbProduct.details.find(
          (detail) => detail.sku === product.sku
        );
        if (!detailProduct) {
          throw new Error('Invalid product details');
        }
        logger.log('detailProduct: ', detailProduct);
        const reservedProduct = {
          ...product,
          size: detailProduct.size,
          inventoryState: {
            state: 'Reserved',
          },
          pictures: dbProduct.pictures[0],
        };
        logger.log('reservedProduct: ', reservedProduct);
        return reservedProduct;
      } catch (err) {
        logger.error(`Product not exist in repository ${err.message}`);
        throw new Error(`Product doesn't exist in repository ${err.message}`);
      }
    })
  );

  logger.log('productsUpdated: ', productsUpdated);

  order.products = productsUpdated;
  return order;
};

const generatePaymentData = (order) => {
  const { paymentData, uuid } = order;
  const {
    transaction: { subTotal, shipping },
    user: { email },
  } = paymentData;
  const urlReturn = `${BASE_URL_FE}?orderNumber=${order.orderNumber}&id=${uuid}`;
  logger.info('Url Return: ', urlReturn);
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

module.exports = {
  getOrderByOrderNumber,
  createOrderPayment,
  confirmOrderPayment,
};
