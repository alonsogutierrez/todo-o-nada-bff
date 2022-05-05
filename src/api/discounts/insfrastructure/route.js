const express = require('express');
const auth = require('./../../../middlewares/auth');
const uploadS3 = require('./../../../middlewares/uploadS3');

const POSTCreateDiscountCoupon = require('../insfrastructure/POSTCreateDiscountCoupon.route');
const GETDiscountCouponByCode = require('../insfrastructure/GETDiscountCouponByCode.route');
const GETAllDiscountCoupon = require('../insfrastructure/GETAllDiscountCoupons.route');

const router = express.Router();

router[POSTCreateDiscountCoupon.method.toLocaleLowerCase()](
  POSTCreateDiscountCoupon.route,
  auth,
  uploadS3.handleImages,
  POSTCreateDiscountCoupon.action
);

router[GETAllDiscountCoupon.method.toLocaleLowerCase()](
  GETAllDiscountCoupon.route,
  auth,
  GETAllDiscountCoupon.action
);

router[GETDiscountCouponByCode.method.toLocaleLowerCase()](
  GETDiscountCouponByCode.route,
  GETDiscountCouponByCode.action
);

module.exports = router;
