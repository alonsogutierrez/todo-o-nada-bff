const { validate } = require('json-schema');

const querySearchProductsSchema = require('./GETSearchProductQuerySchema');

const isValidQuery = query => {
  return validate(query, querySearchProductsSchema);
};

module.exports = isValidQuery;
