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

const getDispatchType = (data) => {
  const { dispatchData } = data;
  if (dispatchData === undefined) {
    throw new Error(`invalid dispatchData ${data.orderNumber}`);
  }
  return dispatchData === 'HOME_DELIVERY'
    ? 'Despacho a domicilio'
    : 'Retiro en tienda';
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

const getClientDni = (data) => {
  const { paymentData } = data;
  if (paymentData === undefined) {
    throw new Error(`invalid paymentData ${data.orderNumber}`);
  }
  const { user } = paymentData;
  if (user === undefined) {
    throw new Error(`invalid user ${data.orderNumber}`);
  }
  const { dni } = user;
  return dni && dni.length > 0 ? dni : '';
};

const getClientAddress = (data) => {
  const { paymentData } = data;
  if (paymentData === undefined) {
    throw new Error(`invalid paymentData ${data.orderNumber}`);
  }
  const { user } = paymentData;
  if (user === undefined) {
    throw new Error(`invalid user ${data.orderNumber}`);
  }
  const { address } = user;
  if (address === undefined) {
    throw new Error(`invalid address ${data.orderNumber}`);
  }
  return address.address && address.address.length > 0 ? address.address : '';
};

const getClientNumAddress = (data) => {
  const { paymentData } = data;
  if (paymentData === undefined) {
    throw new Error(`invalid paymentData ${data.orderNumber}`);
  }
  const { user } = paymentData;
  if (user === undefined) {
    throw new Error(`invalid user ${data.orderNumber}`);
  }
  const { address } = user;
  if (address === undefined) {
    throw new Error(`invalid address ${data.orderNumber}`);
  }

  return address.num_address && address.num_address.length > 0
    ? address.num_address
    : '';
};

const getClientCommune = (data) => {
  const { paymentData } = data;
  if (paymentData === undefined) {
    throw new Error(`invalid paymentData ${data.orderNumber}`);
  }
  const { user } = paymentData;
  if (user === undefined) {
    throw new Error(`invalid user ${data.orderNumber}`);
  }
  const { address } = user;
  if (address === undefined) {
    throw new Error(`invalid address ${data.orderNumber}`);
  }

  return address.commune && address.commune.length > 0 ? address.commune : '';
};

const getClientRegion = (data) => {
  const { paymentData } = data;
  if (paymentData === undefined) {
    throw new Error(`invalid paymentData ${data.orderNumber}`);
  }
  const { user } = paymentData;
  if (user === undefined) {
    throw new Error(`invalid user ${data.orderNumber}`);
  }
  const { address } = user;
  if (address === undefined) {
    throw new Error(`invalid address ${data.orderNumber}`);
  }

  return address.city && address.city.length > 0 ? address.city : '';
};

const getClientCountry = (data) => {
  const { paymentData } = data;
  if (paymentData === undefined) {
    throw new Error(`invalid paymentData ${data.orderNumber}`);
  }
  const { user } = paymentData;
  if (user === undefined) {
    throw new Error(`invalid user ${data.orderNumber}`);
  }
  const { address } = user;
  if (address === undefined) {
    throw new Error(`invalid address ${data.orderNumber}`);
  }

  return address.country && address.country.length > 0 ? address.country : '';
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

const getSize = (product) => {
  const { size } = product;
  if (!size) {
    return '';
  }
  return size;
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
  getDispatchType,
  getClientEmail,
  getClientDni,
  getClientAddress,
  getClientNumAddress,
  getClientCommune,
  getClientRegion,
  getClientCountry,
  getSubTotal,
  getShippingTotal,
  getTotal,
  getItemNumber,
  getSKU,
  getSize,
  getItemPrice,
  getQuantity,
};
