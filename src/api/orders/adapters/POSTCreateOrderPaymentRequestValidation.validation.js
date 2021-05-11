const { validate } = require('json-schema');

const queryCreateOrderPaymentSchema = require('./POSTCreateOrderPaymentSchema');

const isValidQuery = query => {
  return validate(query, queryCreateOrderPaymentSchema);
};

module.exports = isValidQuery;
