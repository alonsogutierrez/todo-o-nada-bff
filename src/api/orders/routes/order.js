const express = require('express');

const POSTCreateOrderPayment = require('../insfrastructure/POSTCreateOrderPayment.route');
const POSTPaymentConfirm = require('../insfrastructure/POSTPaymentConfirm.route');
const Order = require('../../../db/models/order');

const router = express.Router();
const logger = console;

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
