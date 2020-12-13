const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const orderRouter = require('./api/orders/routes/order');
const productRouter = require('./api/products/routes/product');
const userRouter = require('./api/users/routes/user');
const healthRouter = require('./api/health/routes/health');

const app = express();

app.use(cors());
app.use(express.json());
app.use(orderRouter);
app.use(productRouter);
app.use(userRouter);
app.use(healthRouter);

module.exports = app;
