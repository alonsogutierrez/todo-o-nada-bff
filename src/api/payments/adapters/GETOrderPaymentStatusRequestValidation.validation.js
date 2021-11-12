const { validate } = require('json-schema');

const queryGetOrderPaymentStatusSchema = require('./GETOrderPaymentStatusQuerySchema');

const isValidQuery = (query) => {
  return validate(query, queryGetOrderPaymentStatusSchema);
};

module.exports = isValidQuery;
