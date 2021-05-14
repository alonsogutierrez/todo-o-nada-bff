const express = require('express');
const cors = require('cors');
const { connectWithMongodDB } = require('./db/mongoose');
const orderRouter = require('./api/orders/routes/order');
const productRouter = require('./api/products/routes');
const userRouter = require('./api/users/routes/user');
const reportRouter = require('./api/reports/week/routes/week');
const downloadReportRouter = require('./api/reports/betweenDates/routes/betweenDates');
const orderReportRouter = require('./api/reports/orders/routes/orders');
const healthRouter = require('./api/health/routes/health');
const searchRouter = require('./api/search/routes/search');

try {
  connectWithMongodDB();
} catch (err) {
  throw new Error(err.message);
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(healthRouter);
app.use(orderRouter);
app.use(productRouter);
app.use(userRouter);
app.use(reportRouter);
app.use(downloadReportRouter);
app.use(orderReportRouter);
app.use(searchRouter);

module.exports = app;
