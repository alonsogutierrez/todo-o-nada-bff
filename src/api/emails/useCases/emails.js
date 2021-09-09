const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const logger = console;

const sendTo = async (msg) => {
  logger.info('msg: ', msg);
  const msgByDefault = {
    to: 'alonso.gutierrez@mail.udp.cl', // Change to your recipient
    from: 'alonso.gutierrez@mail.udp.cl', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    templateId: 'd-cdfbff5212bc420688cc03b85d992197',
    substitutions: {
      name: 'Some One',
      city: 'Denver',
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
