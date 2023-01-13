const express = require('express');

const auth = require('./../../../../middlewares/auth');
const uploadBannerS3 = require('./../../../../middlewares/s3/uploadBannerImages');
const GETBanners = require('./GETBanners.route');
const GETBannerByBannerNumber = require('./GETBannerByBannerNumber.route');
const POSTCreateBanner = require('./POSTCreateBanner.route');
const PUTEditBanner = require('./PUTEditBanner.route');
const DELETEDeleteBanner = require('./DELETEDeleteBanner.route');

const router = express.Router();

router[GETBanners.method.toLocaleLowerCase()](
  GETBanners.route,
  GETBanners.action
);

router[GETBannerByBannerNumber.method.toLocaleLowerCase()](
  GETBannerByBannerNumber.route,
  auth,
  GETBannerByBannerNumber.action
);

router[POSTCreateBanner.method.toLocaleLowerCase()](
  POSTCreateBanner.route,
  [auth, uploadBannerS3.handleBannerImages],
  POSTCreateBanner.action
);

router[PUTEditBanner.method.toLocaleLowerCase()](
  PUTEditBanner.route,
  [auth, uploadBannerS3.handleBannerImages],
  PUTEditBanner.action
);

router[DELETEDeleteBanner.method.toLocaleLowerCase()](
  DELETEDeleteBanner.route,
  auth,
  DELETEDeleteBanner.action
);

module.exports = router;
