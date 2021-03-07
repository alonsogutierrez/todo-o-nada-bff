const express = require('express');
const Order = require('../../../db/models/order');
const idBuilder = require('../idBuilder');
const router = new express.Router();

const logger = console;

router.post('/orders', async (req, res) => {
  try {
    const orderNumber = await idBuilder.generateOrderId();
    req.body.orderNumber = orderNumber;
    const order = new Order(req.body);
    logger.log('Order: ', order);
    await order.save();
    logger.log('Order saved succesfully!');
    res.status(201).send({ order });
  } catch (e) {
    logger.error('Can`t save order: ', e.message);
    res.status(500).send(e.message);
  }
});

router.get('/orders', async (req, res) => {
  try {
    const query = req.query;
    if (!query) {
      throw new Error('Invalid request');
    }
    const { orderNumber } = query;
    if (!orderNumber) {
      throw new Error('Invalid orderNumber');
    }
    const orderDocs = await Order.find({
      orderNumber: Number(orderNumber)
    });
    if (!orderDocs) {
      res.status(404).send('Order not found');
    }
    logger.log(
      orderDocs.length +
        ' Orders found like orderNumber equal to ' +
        orderNumber
    );
    res.status(200).send(orderDocs);
  } catch (e) {
    logger.error('Can`t found order: ', e.message);
    res.status(500).send(e.message);
  }
});

module.exports = router;
