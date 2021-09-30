const HTTPCodes = require('http-status-codes');
const GETCategoriesUseCases = require('../useCases/category');

const logger = console;

const action = async (req, res) => {
  try {
    const getCategoriesResponse = await GETCategoriesUseCases.getCategories();
    logger.log('Request finished: ', getCategoriesResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(getCategoriesResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't get categories: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/categories',
  action,
};
