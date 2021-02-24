const Order = require('../../../../db/models/order');

const getOrders = async orderPaymentType => {
  const paymentState = orderPaymentType === 'paid' ? 'paid' : 'created'; //TODO: Change by paid orders
  const orders = await Order.find(
    {
      'paymentData.state': paymentState
    },
    [],
    {
      sort: {
        createdAt: -1
      },
      limit: 10,
      projection: {
        orderNumber: 1,
        createdAt: 1,
        paymentData: 1
      }
    }
  ).exec();
  return orders;
};

module.exports = getOrders;
