const express = require('express');
const Order = require('../../../db/models/order');
const idBuilder = require('../idBuilder');
const router = new express.Router();

const logger = console;

router.post('/orders', async (req, res) => {
  //TODO: Create an orderNumber
  const orderNumber = await idBuilder.generateOrderId();
  req.body.orderNumber = orderNumber;
  const order = new Order(req.body);
  logger.log('Order: ', order);
  try {
    await order.save();
    logger.log('Order saved succesfully!');
    res.status(201).send({ order });
  } catch (e) {
    logger.error('Can`t save order: ', e.message);
    res.status(500).send(e.message);
  }
});

module.exports = router;
