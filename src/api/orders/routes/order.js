const express = require('express');

const auth = require('./../../../middlewares/auth');
const GETOrderByOrderNumber = require('./../insfrastructure/GETOrderByOrderNumber.route');
const POSTCreateOrderPayment = require('../insfrastructure/POSTCreateOrderPayment.route');
const POSTPaymentConfirm = require('../insfrastructure/POSTPaymentConfirm.route');
const Order = require('../../../db/models/order');

const router = express.Router();
const logger = console;

router[GETOrderByOrderNumber.method.toLocaleLowerCase()](
  GETOrderByOrderNumber.route,
  GETOrderByOrderNumber.action
);
router[POSTCreateOrderPayment.method.toLocaleLowerCase()](
  POSTCreateOrderPayment.route,
  POSTCreateOrderPayment.action
);
router[POSTPaymentConfirm.method.toLocaleLowerCase()](
  POSTPaymentConfirm.route,
  POSTPaymentConfirm.action
);

router.get('/orders', async (req, res) => {
  try {
    const query = req.query;
    if (!query) {
      throw new Error('Invalid request');
    }
    const { orderNumber, id } = query;
    logger.info(`Validating info: orderNumber => ${orderNumber} & id => ${id}`);
    if (!orderNumber || !id) {
      throw new Error('Invalid params');
    }
    let orderDocs = [];
    orderDocs = await Order.find({
      orderNumber: Number(orderNumber),
      uuid: id,
    });

    if (!orderDocs || orderDocs.length < 1) {
      res.status(404).send({
        message: 'Order not found',
      });
    }
    logger.log(
      orderDocs.length +
        ' Orders found like orderNumber equal to ' +
        orderNumber
    );
    let order = orderDocs[0];
    order = {
      orderNumber: order.orderNumber,
      paymentData: order.paymentData,
      dispatchData: order.dispatchData,
      products: order.products,
      createdAt: order.createdAt,
    };
    res.status(200).send(order);
  } catch (e) {
    logger.error('Can`t found order: ', e.message);
    res.status(500).send(e.message);
  }
});

router.get('/orders/admin', auth, async (req, res) => {
  try {
    const query = req.query;
    if (!query) {
      throw new Error('Invalid request');
    }
    const { orderNumber } = query;
    if (!orderNumber) {
      throw new Error('Invalid params');
    }
    let orderDocs = [];
    orderDocs = await Order.find({
      orderNumber: Number(orderNumber),
    });

    if (!orderDocs || orderDocs.length < 1) {
      res.status(404).send({
        message: 'Order not found',
      });
    }
    logger.log(
      orderDocs.length +
        ' Orders found like orderNumber equal to ' +
        orderNumber
    );
    let order = orderDocs[0];
    order = {
      orderNumber: order.orderNumber,
      paymentData: order.paymentData,
      products: order.products,
      createdAt: order.createdAt,
      dispatchData: order.dispatchData,
    };
    res.status(200).send(order);
  } catch (e) {
    logger.error('Can`t found order: ', e.message);
    res.status(500).send(e.message);
  }
});

module.exports = router;
