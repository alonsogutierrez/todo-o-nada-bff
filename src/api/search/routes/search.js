const express = require('express');

const GETSearchProducts = require('../insfrastructure/GETSearchProducts.route');
const GETSearchProductsByCategory = require('../insfrastructure/GETSearchProductsByCategory.route');
const GETMoreInterestingProducts = require('../insfrastructure/GETMoreInterestingProducts.route');

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

module.exports = router;
