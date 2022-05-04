const express = require('express');
const auth = require('./../../../middlewares/auth');

const POSTCreateDiscountCoupon = require('../insfrastructure/POSTCreateDiscountCoupon.route');

const router = express.Router();

router[POSTCreateDiscountCoupon.method.toLocaleLowerCase()](
  POSTCreateDiscountCoupon.route,
  auth,
  POSTCreateDiscountCoupon.action
);

module.exports = router;
