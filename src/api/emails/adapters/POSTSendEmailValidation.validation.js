const { validate } = require('json-schema');

const querySendEmailSchema = require('./POSTSendEmailSchema');

const isValidQuery = (query) => {
  return validate(query, querySendEmailSchema);
};

module.exports = isValidQuery;
