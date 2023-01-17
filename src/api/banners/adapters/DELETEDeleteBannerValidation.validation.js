const { validate } = require('json-schema');

const queryDeleteCategoriesSchema = require('./DELETEDeleteCategorySchema');

const isValidQuery = (query) => {
  return validate(query, queryDeleteCategoriesSchema);
};

module.exports = isValidQuery;
