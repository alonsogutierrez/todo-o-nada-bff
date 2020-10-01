const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const orderRouter = require('./api/orders/routes/order');

const app = express();

app.use(cors());
app.use(express.json());
app.use(orderRouter);

module.exports = app;
