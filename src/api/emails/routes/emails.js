const express = require('express');
const auth = require('./../../../middlewares/auth');

const POSTSendEmail = require('../insfrastructure/POSTSendEmail.route');

const router = express.Router();

router[POSTSendEmail.method.toLocaleLowerCase()](
  POSTSendEmail.route,
  auth,
  POSTSendEmail.action
);

module.exports = router;
