const express = require('express');
const auth = require('./../../../middlewares/auth');

const GETSearchProducts = require('../insfrastructure/GETSearchProducts.route');
const GETSearchProductsByCategory = require('../insfrastructure/GETSearchProductsByCategory.route');
const GETMoreInterestingProducts = require('../insfrastructure/GETMoreInterestingProducts.route');
const GETAdminProducts = require('../insfrastructure/GETAdminProducts.route');

const router = express.Router();

router[GETSearchProducts.method.toLocaleLowerCase()](
  GETSearchProducts.route,
  GETSearchProducts.action
);

router[GETSearchProductsByCategory.method.toLocaleLowerCase()](
  GETSearchProductsByCategory.route,
  GETSearchProductsByCategory.action
);

router[GETMoreInterestingProducts.method.toLocaleLowerCase()](
  GETMoreInterestingProducts.route,
  GETMoreInterestingProducts.action
);

router[GETAdminProducts.method.toLocaleLowerCase()](
  GETAdminProducts.route,
  auth,
  GETAdminProducts.action
);

module.exports = router;
