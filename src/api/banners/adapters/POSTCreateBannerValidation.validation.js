const { validate } = require('json-schema');

const queryCreateCategoriesSchema = require('./POSTCreateCategorySchema');

const isValidQuery = (query) => {
  return validate(query, queryCreateCategoriesSchema);
};

module.exports = isValidQuery;
