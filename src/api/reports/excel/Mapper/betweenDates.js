const dateFns = require('date-fns');

const getOrderNumber = (data) => {
  const { orderNumber } = data;
  if (Number.isInteger(orderNumber)) {
    return orderNumber;
  }
  throw new Error(`Cant get order number: ${data.orderNumber}`);
};

const getTransactionDate = (data) => {
  const { createdAt } = data;
  if (createdAt === undefined) {
    throw new Error(`invalid date ${data.orderNumber}`);
  }
  const date = dateFns.format(createdAt, 'yyyy-MM-dd');
  if (dateFns.isValid(new Date(date))) {
    return date;
  }
  throw new Error(`Cant get transaction date ${data.orderNumber}`);
};

const getClientNames = (data) => {
  const { paymentData } = data;
  if (paymentData === undefined) {
    throw new Error(`invalid paymentData ${data.orderNumber}`);
  }
  const { user } = paymentData;
  if (user === undefined) {
    throw new Error(`invalid user ${data.orderNumber}`);
  }
  const { firstName, lastName } = user;
  if (firstName === undefined || lastName === undefined) {
    throw new Error(`invalid firstName or lastName ${data.orderNumber}`);
  }
  return firstName + ' ' + lastName;
};

const getClientEmail = (data) => {
  const { paymentData } = data;
  if (paymentData === undefined) {
    throw new Error(`invalid paymentData ${data.orderNumber}`);
  }
  const { user } = paymentData;
  if (user === undefined) {
    throw new Error(`invalid user ${data.orderNumber}`);
  }
  const { email } = user;
  if (email === undefined) {
    throw new Error(`invalid email ${data.orderNumber}`);
  }
  return email;
};

const getSubTotal = (data) => {
  const { paymentData } = data;
  if (paymentData === undefined) {
    throw new Error(`invalid paymentData ${data.orderNumber}`);
  }
  const { transaction } = paymentData;
  if (transaction === undefined) {
    throw new Error(`invalid transaction ${data.orderNumber}`);
  }
  const { subTotal } = transaction;
  if (subTotal === undefined) {
    throw new Error(`invalid subTotal ${data.orderNumber}`);
  }
  return subTotal;
};

const getShippingTotal = (data) => {
  const { paymentData } = data;
  if (paymentData === undefined) {
    throw new Error(`invalid paymentData ${data.orderNumber}`);
  }
  const { transaction } = paymentData;
  if (transaction === undefined) {
    throw new Error(`invalid transaction ${data.orderNumber}`);
  }
  const { shipping } = transaction;
  if (shipping === undefined) {
    throw new Error(`invalid shipping ${data.orderNumber}`);
  }
  return shipping;
};

const getTotal = (data) => {
  const { paymentData } = data;
  if (paymentData === undefined) {
    throw new Error(`invalid paymentData: ${data.orderNumber}`);
  }
  const { transaction } = paymentData;
  if (transaction === undefined) {
    throw new Error(`invalid transaction: ${data.orderNumber}`);
  }
  const { shipping, subTotal } = transaction;
  if (shipping === undefined || subTotal === undefined) {
    throw new Error(`invalid shipping or subTotal: ${data.orderNumber}`);
  }
  return shipping + subTotal;
};

const getItemNumber = (product) => {
  const { itemNumber } = product;
  if (itemNumber === undefined) {
    console.error('itemNumber undefined');
    return 0;
  }
  return itemNumber;
};

const getSKU = (product) => {
  const { sku } = product;
  if (sku === undefined) {
    console.error('sku undefined');
    return 0;
  }
  return sku;
};

const getItemPrice = (product) => {
  const { price } = product;
  if (price === undefined) {
    throw new Error(`Invalid price`);
  }
  return price.basePriceSales;
};

const getQuantity = (product) => {
  const { quantity } = product;
  if (quantity === undefined) {
    throw new Error(`invalid quantity`);
  }
  return quantity;
};

module.exports = {
  getOrderNumber,
  getTransactionDate,
  getClientNames,
  getClientEmail,
  getSubTotal,
  getShippingTotal,
  getTotal,
  getItemNumber,
  getSKU,
  getItemPrice,
  getQuantity,
};
