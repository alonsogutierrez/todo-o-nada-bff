const sendEmailSchema = {
  title: 'SendEmailSchema',
  description: 'describes properties required to send an email',
  type: 'object',
  properties: {
    orderNumber: {
      type: 'string',
      description: 'orderNumber that identifies order associated to send email',
    },
  },
};

module.exports = sendEmailSchema;
