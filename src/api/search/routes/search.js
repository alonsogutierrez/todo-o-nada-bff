const express = require('express');

const GETSearchProducts = require('../insfrastructure/GETSearchProducts.route');

const router = express.Router();

router[GETSearchProducts.method.toLocaleLowerCase()](
  GETSearchProducts.route,
  GETSearchProducts.action
);

module.exports = router;
