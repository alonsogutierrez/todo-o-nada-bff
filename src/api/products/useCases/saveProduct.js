const { validate } = require('json-schema');

const productSchema = require('../schema/product');
const Product = require('../../../db/models/product');
const ElasticSearchRestData = require('../../shared/infrastructure/ElasticSearchRESTData');

const logger = console;

const saveProduct = async productInput => {
  if (validate(productInput, productSchema)) {
    const product = new Product(productInput);
    logger.log('Trying to save product in MongoDB');
    await product.save();
    logger.log('Product document well saved in MongoDB');

    const productToIndex = {
      id: product._id,
      itemNumber: product.itemNumber,
      name: product.name,
      categories: product.category,
      description: product.description,
      color: product.color,
      sizeDetail: product.details.map(detail => detail.size),
      price: product.price,
      quantity: product.details.reduce((quantity, currentQuantity) => quantity + currentQuantity.stock, 0)
    };
    logger.log('Trying to save product document in elasticSearch');
    await ElasticSearchRestData.CreateRequest(
      'products',
      productToIndex
    );
    logger.log('Product well indexed in elasticSearch');
    return productToIndex;
  } else {
    logger.error('Product invalid');
    throw new Error('Invalid product data');
  }
};

module.exports = saveProduct;
