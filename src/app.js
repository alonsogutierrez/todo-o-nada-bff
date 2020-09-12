const express = require('express');
require('./db/mongoose');
const orderRouter = require('./api/orders/routes/order');

const app = express();

app.use(express.json());
app.use(orderRouter);

module.exports = app;
