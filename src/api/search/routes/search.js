const express = require('express');
const auth = require('./../../../middlewares/auth');

const GETSearchProducts = require('../insfrastructure/GETSearchProducts.route');
const GETSearchProductsByCategory = require('../insfrastructure/GETSearchProductsByCategory.route');
const GETMoreInterestingProducts = require('../insfrastructure/GETMoreInterestingProducts.route');
const GETMoreInterestingProducts2 = require('../insfrastructure/GETMoreInterestingProducts2.route');
const GETMoreInterestingProducts3 = require('../insfrastructure/GETMoreInterestingProducts3.route');
const GETMoreInterestingProducts4 = require('../insfrastructure/GETMoreInterestingProducts4.route');
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

router[GETMoreInterestingProducts2.method.toLocaleLowerCase()](
  GETMoreInterestingProducts2.route,
  GETMoreInterestingProducts2.action
);

router[GETMoreInterestingProducts3.method.toLocaleLowerCase()](
  GETMoreInterestingProducts3.route,
  GETMoreInterestingProducts3.action
);

router[GETMoreInterestingProducts4.method.toLocaleLowerCase()](
  GETMoreInterestingProducts4.route,
  GETMoreInterestingProducts4.action
);

router[GETAdminProducts.method.toLocaleLowerCase()](
  GETAdminProducts.route,
  auth,
  GETAdminProducts.action
);

module.exports = router;
