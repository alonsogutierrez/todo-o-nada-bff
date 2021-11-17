const HTTPCodes = require('http-status-codes');
const SendEmailUseCases = require('../useCases/emails');
const isValidQuery = require('../adapters/POSTSendEmailValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const { query } = req.query;
    logger.log('Validating query to send email');
    if (!isValidQuery({ query })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params to send email',
      });
      return;
    }
    logger.log('Begining to send email');
    const sendEmailResponse = await SendEmailUseCases.sendEmail(query);
    logger.log('Request finished: ', sendEmailResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(sendEmailResponse);
  } catch (err) {
    logger.error(`Can't send email: ${err.message}`);
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't send email: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'POST',
  route: '/send/email',
  action,
};
