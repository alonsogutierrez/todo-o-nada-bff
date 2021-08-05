const { validate } = require('json-schema');

const queryCreateUserSchema = require('./POSTCreateUserSchema');

const isValidQuery = (query) => {
  return validate(query, queryCreateUserSchema);
};

module.exports = isValidQuery;
