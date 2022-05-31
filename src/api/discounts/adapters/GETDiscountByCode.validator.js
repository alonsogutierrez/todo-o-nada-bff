const { validate } = require('json-schema');

const getDiscountCouponByCodeSchema = require('./GETDiscountCouponByCodeSchema');

const isValidQuery = (query) => {
  return validate(query, getDiscountCouponByCodeSchema);
};

module.exports = isValidQuery;
