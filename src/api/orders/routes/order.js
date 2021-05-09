const express = require('express');
const CryptoJS = require('crypto-js');
const Order = require('../../../db/models/order');
const idBuilder = require('../idBuilder');
const router = new express.Router();

const RemoteRestData = require('../../shared/infrastructure/RemoteRESTData');
const FLOW_API_BASE_URL = process.env.FLOW_API_BASE_URL;
const FLOW_API_SECRET_KEY = process.env.FLOW_API_SECRET_KEY;
const FLOW_API_KEY = process.env.FLOW_API_KEY;
console.log('FLOW_API_BASE_URL: ', FLOW_API_BASE_URL);
console.log('FLOW_API_SECRET_KEY: ', FLOW_API_SECRET_KEY);
console.log('FLOW_API_KEY: ', FLOW_API_KEY);

const logger = console;

router.post('/orders', async (req, res) => {
  try {
    //TODO: Modify to call Payment API
    let messageToSign = '';
    const orderNumber = await idBuilder.generateOrderId();
    req.body.orderNumber = orderNumber;
    const orderData = req.body;
    console.log('orderData: ', orderData);
    const orderAttributesBody = {
      amount:
        orderData.paymentData.transaction.subTotal +
        orderData.paymentData.transaction.shipping,
      apiKey: FLOW_API_KEY,
      commerceOrder: `${orderData.orderNumber}`,
      currency: 'CLP',
      email: orderData.paymentData.user.email,
      payment_currency: 'CLP',
      subject: 'Compra TODO O NADA',
      urlConfirmation: 'https://todoonada.cl/success',
      urlReturn: 'https://todoonada.cl'
    };
    for (const key in orderAttributesBody) {
      messageToSign = messageToSign.concat(key + orderAttributesBody[key]);
    }
    console.log('message to sign: ', messageToSign);
    const s = CryptoJS.HmacSHA256(
      messageToSign,
      FLOW_API_SECRET_KEY
    ).toString();
    console.log('s: ', s);
    console.log('Trying to create an order payment');
    const generateOrderResponse = await RemoteRestData.POSTRequest(
      FLOW_API_BASE_URL,
      '/payment/create',
      {},
      {
        amount:
          parseInt(orderData.paymentData.transaction.subTotal, 10) +
          parseInt(orderData.paymentData.transaction.shipping, 10),
        apiKey: FLOW_API_KEY,
        commerceOrder: `${orderData.orderNumber}`,
        currency: 'CLP',
        email: orderData.paymentData.user.email,
        payment_currency: 'CLP',
        subject: 'Compra TODO O NADA',
        urlConfirmation: 'https://todoonada.cl/success',
        urlReturn: 'https://todoonada.cl',
        s
      }
    );
    console.log('generatePaymentOrderResponse: ', generateOrderResponse);
    const { token, url, flowOrder } = generateOrderResponse;
    if (token && url && flowOrder) {
      logger.log('Order well created in Payment Platform');
      const order = new Order(orderData);
      await order.save();
      logger.log('Order well saved in DB');
      res.status(201).send({
        redirect_to: `${url}?token=${token}`,
        flowOrder,
        order
      });
    } else {
      const { code, message } = generateOrderResponse;
      if (code && message) {
        res.status(400).send({
          code,
          message
        });
      }
    }
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
