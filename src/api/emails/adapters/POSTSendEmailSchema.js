const sendEmailSchema = {
  title: 'SendEmailSchema',
  description: 'describes properties required to end an email',
  type: 'object',
  properties: {
    to: {
      type: 'string',
      description: 'email who will receive our email',
    },
    from: {
      type: 'string',
      description: 'email who will send our email',
    },
    subject: {
      type: 'string',
      description: 'email subject',
    },
    text: {
      type: 'string',
      description: 'text in email',
    },
    html: {
      type: 'string',
      description: 'html code in email',
    },
  },
};

module.exports = sendEmailSchema;
