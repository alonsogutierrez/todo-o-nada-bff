const { validate } = require('json-schema');

const GETOrderByOrderNumberSchema = require('./GETOrderByOrderNumberSchema');

const isValidQuery = (query) => {
  return validate(query, GETOrderByOrderNumberSchema);
};

module.exports = isValidQuery;
