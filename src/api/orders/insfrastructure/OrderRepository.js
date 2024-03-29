const Order = require('../../../db/models/order');

const save = async (orderData) => {
  try {
    const order = new Order(orderData);
    return await order.save();
  } catch (err) {
    throw new Error(`Can't save order in repository: ${err.message}`);
  }
};

const findOne = async (filters) => {
  try {
    const order = await Order.findOne(filters);
    if (order) {
      return order.toJSON();
    }
    throw new Error('Order not exist');
  } catch (err) {
    throw new Error(`Can't find order in repository: ${err.message}`);
  }
};

const updateOne = async (filters, newData) => {
  try {
    const order = await Order.updateOne(filters, newData);
    return order;
  } catch (err) {
    throw new Error(`Can't find order in repository: ${err.message}`);
  }
};

module.exports = { save, findOne, updateOne };
