const HTTPCodes = require('http-status-codes');

const UsersUseCases = require('./../useCases/users');
const isValidQuery = require('../adapters/POSTCreateUser.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const body = req.body;
    logger.log('Validating query');
    if (!isValidQuery({ body })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params',
      });
      return;
    }
    logger.log('Begining to create user');
    const createUserResponse = await UsersUseCases.create(body);
    logger.log('Request finished: ', createUserResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(createUserResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't create user: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'POST',
  route: '/users',
  action,
};
