const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const senderEmail = process.env.SENDER_EMAIL;

const logger = console;

const getProductsData = (products) => {
  products.map((product) => {
    return {
      name: product.name,
      picture: product.pictures,
      price: product.price.basePriceSales,
    };
  });
};

const getMessageData = (orderPaid) => {
  const { products, paymentData, dispatchData, orderNumber } = orderPaid;
  const { user, transaction } = paymentData;
  const { address } = user;
  return {
    to: user.email,
    from: senderEmail,
    subject: 'Confirmación de compra',
    text: 'Todo o Nada Tattoo Art Web',
    html: '<h2>Hemos confirmado tu compra!</h2>',
    templateId: process.env.SENDGRID_CONFIRMATION_TEMPLATE,
    dynamic_template_data: {
      orderNumber,
      deliveryDateLabel:
        dispatchData === 'HOME_DELIVERY'
          ? 'Fecha estimada de entrega'
          : 'Fecha de retiro',
      deliveryDate:
        dispatchData === 'HOME_DELIVERY'
          ? '5 días hábiles'
          : 'Coordinar por WhatsApp/Instagram',
      addressLabel:
        dispatchData === 'HOME_DELIVERY'
          ? 'Dirección de entrega'
          : 'Dirección de retiro',
      address:
        address.address + ', ' + address.num_address + '. ' + address.commune,
      customerName: user.firstName,
      items: getProductsData(products),
      subTotal:
        '$' +
        transaction.subTotal
          .toFixed(0)
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.'),
      dispatchCost:
        '$' +
        transaction.shipping
          .toFixed(0)
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.'),
      total:
        '$' +
        (transaction.shipping + transaction.subTotal)
          .toFixed(0)
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.'),
      senderName: senderEmail,
      senderAddress: 'Catedral 2116, Santiago',
    },
  };
};

const sendEmail = async (orderPaid) => {
  logger.info('orderPaid: ', orderPaid);
  const msgToSend = getMessageData(orderPaid);
  logger.info('msgToSend: ', msgToSend);
  try {
    const msgResult = await sgMail.send(msgToSend);
    logger.log('Message send succesfully: ', msgResult);
    return { msgResult };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { sendEmail };
