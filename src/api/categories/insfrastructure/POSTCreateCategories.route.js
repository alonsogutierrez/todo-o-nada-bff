const HTTPCodes = require('http-status-codes');
const CreateCategoryUseCases = require('../useCases/category');
const isValidQuery = require('../adapters/POSTCreateCategoryValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const { body } = req;
    logger.log('Validating query to create categories');
    if (!isValidQuery({ body })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params',
      });
      return;
    }
    logger.log('Begining to create categories', body);
    const createCategoriesResponse =
      await CreateCategoryUseCases.createCategories(body);
    logger.log('Request finished: ', createCategoriesResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(createCategoriesResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't create categories: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'POST',
  route: '/categories',
  action,
};
