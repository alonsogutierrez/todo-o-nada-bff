const express = require('express');

const auth = require('../../../../middlewares/auth');
const GETCategories = require('../GETCategories.route');
const POSTCreateCategories = require('../POSTCreateCategories.route');
const GETCategoriesNavLinks = require('../GETCategoriesNavLinks.route');

const router = express.Router();
const logger = console;

router[GETCategories.method.toLocaleLowerCase()](
  GETCategories.route,
  auth,
  GETCategories.action
);

router[POSTCreateCategories.method.toLocaleLowerCase()](
  POSTCreateCategories.route,
  auth,
  POSTCreateCategories.action
);

router[GETCategoriesNavLinks.method.toLocaleLowerCase()](
  GETCategoriesNavLinks.route,
  GETCategoriesNavLinks.action
);

module.exports = router;
