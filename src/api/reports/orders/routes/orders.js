const express = require('express');
const auth = require('./../../../../middlewares/auth');
const getOrders = require('../useCases/getOrders');

const router = new express.Router();

const logger = console;

router.get('/reports/orders', auth, async (req, res) => {
  try {
    const paymentType = req.query.paymentType;
    logger.log(`Going to get ${paymentType} orders`);
    const orders = await getOrders(paymentType);
    res.status(200).send(orders);
  } catch (e) {
    logger.error(`Can't get ${paymentType} orders: ${e.message}`);
    res.status(500).send(e.message);
  }
});

module.exports = router;
