const Order = require('../../../db/models/order');

const save = async orderData => {
  try {
    const order = new Order(orderData);
    return await order.save().toJSON();
  } catch (err) {
    throw new Error(`Can't save order in repository: ${err.message}`);
  }
};

const findOne = async filters => {
  try {
    const order = await Order.findOne(filters);
    return order.toJSON();
  } catch (err) {
    throw new Error(`Can't find order in repository: ${err.message}`);
  }
};

const updateOne = async (filters, newData) => {
  try {
    const order = await Order.updateOne(filters, newData);
    return order.toJSON();
  } catch (err) {
    throw new Error(`Can't find order in repository: ${err.message}`);
  }
};

module.exports = { save, findOne, updateOne };
