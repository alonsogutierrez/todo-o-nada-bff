const confirmPaymentStatusSchema = {
    title: 'ConfirmPaymentStatusSchema',
    description: 'describes properties required to confirm an order payment',
    type: 'object',
    properties: {
      token: {
        type: 'string',
        description: 'payment token'
      }
    }
  };
  
  module.exports = confirmPaymentStatusSchema;
  