const Order = require('../../../db/models/order');

const saveOrder = async orderData => {
  try {
    const order = new Order(orderData);
    await order.save();
    return order;
  } catch (err) {
    throw new Error(`Can't save order in repository: ${err.message}`);
  }
};

module.exports = { saveOrder };
