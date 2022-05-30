const express = require('express');
const auth = require('./../../../middlewares/auth');

const POSTCreateDiscountCoupon = require('../insfrastructure/POSTCreateDiscountCoupon.route');
const GETDiscountCouponByCode = require('../insfrastructure/GETDiscountCouponByCode.route');
const GETFindAllDiscountCoupon = require('../insfrastructure/GETFindAllDiscountCoupon.route');

const router = express.Router();

router[POSTCreateDiscountCoupon.method.toLocaleLowerCase()](
  POSTCreateDiscountCoupon.route,
  auth,
  POSTCreateDiscountCoupon.action
);

router[GETDiscountCouponByCode.method.toLocaleLowerCase()](
  GETDiscountCouponByCode.route,
  GETDiscountCouponByCode.action
);

router[GETFindAllDiscountCoupon.method.toLocaleLowerCase()](
  GETFindAllDiscountCoupon.route,
  GETFindAllDiscountCoupon.action
);

module.exports = router;
