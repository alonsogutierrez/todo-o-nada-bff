const { validate } = require('json-schema');

const queryConfirmPaymentStatusSchema = require('./POSTConfirmPaymentStatusSchema');

const isValidQuery = query => {
  return validate(query, queryConfirmPaymentStatusSchema);
};

module.exports = isValidQuery;
