const { validate } = require('json-schema');

const createDiscountCouponSchema = require('./POSTCreateDiscountCouponSchema');

const isValidQuery = (query) => {
  return validate(query, createDiscountCouponSchema).valid;
};

module.exports = isValidQuery;
