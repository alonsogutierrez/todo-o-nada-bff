const getOrderPaymentStatusSchema = {
  title: 'GET Order Payment Status Schema',
  description: 'describes properties required to get payment status from order',
  type: 'object',
  properties: {
    query: 'string',
    minLength: 2,
    maxLength: 50,
  },
};

module.exports = getOrderPaymentStatusSchema;
