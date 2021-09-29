const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const logger = console;

const sendTo = async (msg) => {
  logger.info('msg: ', msg);
  const msgByDefault = {
    to: 'alonso.gutierrez@mail.udp.cl', // Change to your recipient
    from: 'contacto@todoonadatattooart.cl', //'alonso.gutierrez@mail.udp.cl', // Change to your verified sender
    subject: 'Compra Todo o Nada',
    text: 'Todo o Nada Tattoo Art Web',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    templateId: process.env.SENDGRID_CONFIRMATION_TEMPLATE,
    substitutions: {
      orderNumber: 123,
      deliveryDateLabel: 'Fecha de entrega',
      deliveryDate: '2021/09/21',
      addressLabel: 'Dirección de entrega',
      address: 'Calle 123, Stgo',
      customerName: 'Jose',
      items: [
        {
          name: 'product1',
          picture:
            'https://todo-o-nada-imagenes.s3.us-east-2.amazonaws.com/images/products/7.jpg',
          price: '1.200',
        },
      ],
      subTotal: '$15.000',
      dispatchCost: '$0',
      total: '$15.000',
      senderName: 'contacto@todoonadatattooart.cl',
      senderAddress: 'stgo',
    },
  };
  try {
    const msgResult = await sgMail.send(msgByDefault);
    logger.log('Message send succesfully: ', msgResult);
    return { msgResult };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { sendTo };
