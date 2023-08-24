const express = require('express');

const auth = require('./../../../middlewares/auth');
const GETCarrousels = require('./GETCarrousels.route');
const POSTCreateCarrousels = require('./POSTCreateCarrousels.route');

const router = express.Router();

router[GETCarrousels.method.toLocaleLowerCase()](
  GETCarrousels.route,
  GETCarrousels.action
);

router[POSTCreateCarrousels.method.toLocaleLowerCase()](
  POSTCreateCarrousels.route,
  [auth],
  POSTCreateCarrousels.action
);

module.exports = router;
