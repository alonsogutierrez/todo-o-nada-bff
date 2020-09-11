const express = require('express');
require('./db/mongoose');
const orderRouter = require('./routes/order');

const app = express();

app.use(express.json());
app.use(orderRouter);

module.exports = app;
