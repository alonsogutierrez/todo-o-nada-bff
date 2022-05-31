const { validate } = require('json-schema');

const queryDownloadProductsStatusSchema = require('./GETDownloadProductsQuerySchema');

const isValidQuery = (query) => {
  return validate(query, queryDownloadProductsStatusSchema);
};

module.exports = isValidQuery;
