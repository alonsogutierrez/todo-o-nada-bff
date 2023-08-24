const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const { connectWithMongodDB } = require('./db/mongoose');
const orderRouter = require('./api/orders/routes/order');
const productRouter = require('./api/products/routes');
const userRouter = require('./api/users/routes/user');
const reportRouter = require('./api/reports/week/routes/week');
const downloadReportRouter = require('./api/reports/betweenDates/routes/betweenDates');
const downloadProductReportRouter = require('./api/reports/products/infrastructure/route');
const orderReportRouter = require('./api/reports/orders/routes/orders');
const healthRouter = require('./api/health/routes/health');
const searchRouter = require('./api/search/routes/search');
const emailsRouter = require('./api/emails/routes/emails');
const categoriesRouter = require('./api/categories/insfrastructure/routes/category');
const paymentsRouter = require('./api/payments/insfrastructure/routes');
const discountsRouter = require('./api/discounts/insfrastructure/route');
const bannersRouter = require('./api/banners/insfrastructure/routes/banners');
const carrouselsRouter = require('./api/carrousels/infrastructure/routes');

const { getInterestingProducts } = require('./cron/jobs');

const logger = console;

try {
  connectWithMongodDB();
} catch (err) {
  throw new Error(err.message);
}

const app = express();

const corsWhiteList = [
  process.env.FE_URL,
  process.env.FE_URL_WITHOUT_DNS,
  process.env.BASE_URL_BFF,
  process.env.FE_URL_WITHOUT_WWW,
];
const corsOptions = {
  origin: corsWhiteList,
};

const cronExpression = process.env.CRON_EXPRESSION;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(healthRouter);
app.use(orderRouter);
app.use(productRouter);
app.use(userRouter);
app.use(reportRouter);
app.use(downloadReportRouter);
app.use(downloadProductReportRouter);
app.use(orderReportRouter);
app.use(searchRouter);
app.use(emailsRouter);
app.use(categoriesRouter);
app.use(paymentsRouter);
app.use(discountsRouter);
app.use(bannersRouter);
app.use(carrouselsRouter);

cron.schedule(cronExpression, async function () {
  await getInterestingProducts();
});

module.exports = app;
