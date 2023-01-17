const { validate } = require('json-schema');

const queryEditCategoriesSchema = require('./PUTEditCategorySchema');

const isValidQuery = (query) => {
  return validate(query, queryEditCategoriesSchema);
};

module.exports = isValidQuery;
