const express = require('express');
const router = new express.Router();
const Order = require('../models/order');

const logger = console;

router.post('/orders', async (req, res) => {
  //TODO: Create an orderNumber
  req.body.orderNumber = 10000;
  const order = new Order(req.body);
  logger.log('Order: ', order);
  try {
    const order = await order.save();
    logger.log('Order saved succesfully');
    res.status(201).send({ order });
  } catch (e) {
    logger.error('Can`t save order: ', e.message);
    res.status(400).send(e.message);
  }
});
