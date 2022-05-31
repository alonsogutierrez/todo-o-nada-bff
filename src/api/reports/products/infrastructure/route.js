const express = require('express');

const GETDownloadProducts = require('./GETDownloadProducts.route');

const router = express.Router();

router[GETDownloadProducts.method.toLocaleLowerCase()](
  GETDownloadProducts.route,
  GETDownloadProducts.action
);
module.exports = router;
