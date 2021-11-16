const HTTPCodes = require('http-status-codes');
const GETCategoryNavLinksUseCases = require('../useCases/category');

const logger = console;

const action = async (req, res) => {
  try {
    const getCategoriesNavLinksResponse =
      await GETCategoryNavLinksUseCases.getCategoriesNavLinks();
    logger.log('Request finished: ', getCategoriesNavLinksResponse);
    res.status(HTTPCodes.StatusCodes.OK).send(getCategoriesNavLinksResponse);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't get categories: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/categories/nav-links',
  action,
};
