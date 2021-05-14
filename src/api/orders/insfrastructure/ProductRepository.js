const Product = require('../../../db/models/product');

const findOne = async (filters) => {
  try {
    const productInDB = await Product.findOne(filters);
    return productInDB;
  } catch (err) {
    throw new Error(`Product not found in db ${err.message}`);
  }
};

const updateOne = (filters, newData) => {
    try {
        const productInDB = await Product.updateOne(filters, newData);
        return productInDB;
    } catch (err) {
        throw new Error(`Product not found in db ${err.message}`);
    }
}

module.exports = {
  findOne,
  updateOne
};
