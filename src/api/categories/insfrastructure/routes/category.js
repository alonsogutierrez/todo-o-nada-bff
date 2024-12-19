const express = require("express");

const auth = require("../../../../middlewares/auth");
const GETCategories = require("../GETCategories.route");
const POSTCreateCategories = require("../POSTCreateCategories.route");
const GETCategoriesNavLinks = require("../GETCategoriesNavLinks.route");

const router = express.Router();

// Get Categories
router[GETCategories.method.toLocaleLowerCase()](
  GETCategories.route,
  auth,
  GETCategories.action
);

// Post Categories
router[POSTCreateCategories.method.toLocaleLowerCase()](
  POSTCreateCategories.route,
  auth,
  POSTCreateCategories.action
);

// Get Categories Nav Links
router[GETCategoriesNavLinks.method.toLocaleLowerCase()](
  GETCategoriesNavLinks.route,
  GETCategoriesNavLinks.action
);

module.exports = router;
