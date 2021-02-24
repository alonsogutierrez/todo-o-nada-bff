const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const orderRouter = require('./api/orders/routes/order');
const userRouter = require('./api/users/routes/user');
const reportRouter = require('./api/reports/week/routes/week');
const downloadReportRouter = require('./api/reports/betweenDates/routes/betweenDates');
const orderReportRouter = require('./api/reports/orders/routes/orders');
const healthRouter = require('./api/health/routes/health');

const app = express();

app.use(cors());
app.use(express.json());
app.use(healthRouter);
app.use(orderRouter);
app.use(userRouter);
app.use(reportRouter);
app.use(downloadReportRouter);
app.use(orderReportRouter);

module.exports = app;
