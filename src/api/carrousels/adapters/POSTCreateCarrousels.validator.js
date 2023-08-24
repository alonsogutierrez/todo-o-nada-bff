const { validate } = require('json-schema');

const queryCreateCarrouselsSchema = require('./POSTCreateCarrouselsSchema');

const isValidQuery = (query) => {
  return validate(query, queryCreateCarrouselsSchema);
};

module.exports = isValidQuery;
