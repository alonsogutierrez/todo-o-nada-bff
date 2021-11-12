const express = require('express');

const auth = require('./../../../middlewares/auth');
const GETOrderPaymentStatus = require('../insfrastructure/GETOrderPaymentStatus.route');

const router = express.Router();

router[GETOrderPaymentStatus.method.toLocaleLowerCase()](
  GETOrderPaymentStatus.route,
  GETOrderPaymentStatus.action
);
module.exports = router;
