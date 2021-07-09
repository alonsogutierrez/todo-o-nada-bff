const store_dispatch = 'PICKUP';
const home_delivery = 'HOME_DELIVERY';

const orderPaymentSchema = {
  title: 'OrderPaymentSchema',
  description: 'describes properties required to create an order payment',
  type: 'object',
  properties: {
    paymentData: {
      type: 'object',
      description: 'payment data info',
    },
    products: {
      type: 'array',
      description: 'array with all products to pay',
    },
    dispatchData: {
      type: 'string',
      description: 'dispatch data description',
      enum: [store_dispatch, home_delivery],
    },
  },
};

module.exports = orderPaymentSchema;
