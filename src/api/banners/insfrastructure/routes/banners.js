const express = require('express');

const auth = require('../../../../middlewares/auth');
const GETBanners = require('./GETBanners.route');
const POSTCreateBanner = require('./PUTEditBanner.route');
const PUTEditBanner = require('./PUTEditBanner.route');
const DELETEDeleteBanner = require('./DELETEDeleteBanner.route');

const router = express.Router();

router[GETBanners.method.toLocaleLowerCase()](
  GETBanners.route,
  GETBanners.action
);

router[POSTCreateBanner.method.toLocaleLowerCase()](
  POSTCreateBanner.route,
  auth,
  POSTCreateBanner.action
);

router[PUTEditBanner.method.toLocaleLowerCase()](
  PUTEditBanner.route,
  auth,
  PUTEditBanner.action
);

router[DELETEDeleteBanner.method.toLocaleLowerCase()](
  DELETEDeleteBanner.route,
  auth,
  DELETEDeleteBanner.action
);

module.exports = router;
