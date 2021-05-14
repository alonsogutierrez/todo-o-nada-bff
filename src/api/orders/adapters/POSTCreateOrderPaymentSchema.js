const orderPaymentSchema = {
  title: 'OrderPaymentSchema',
  description: 'describes properties required to create an order payment',
  type: 'object',
  properties: {
    paymentData: {
      type: 'object',
      description: 'payment data info'
    },
    products: {
      type: 'array',
      description: 'array with all products to pay'
    }
  }
};

module.exports = orderPaymentSchema;
