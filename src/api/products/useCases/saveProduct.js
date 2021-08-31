const { validate } = require('json-schema');

const productSchema = require('../schema/product');
const Product = require('../../../db/models/product');
const ElasticSearchRestData = require('../../shared/infrastructure/ElasticSearchRESTData');

const logger = console;

const saveProduct = async (productInput) => {
  if (validate(productInput, productSchema)) {
    const product = new Product(productInput);
    logger.info('Trying to save product in MongoDB');
    await product.save();
    logger.info('Product document well saved in MongoDB');

    const productToIndex = {
      itemNumber: product.itemNumber,
      name: product.name,
      categories: product.category,
      description: product.description,
      color: product.color,
      price: product.price,
      picture: `${process.env.S3_BASE_URL}/images/products/${product.itemNumber}.jpg`,
      details: {},
      sizes: [],
      sizeDetail: product.details.map((detail) => detail.size),
      quantity: product.quantity,
    };
    logger.info('Trying to save product document in elasticSearch');
    await ElasticSearchRestData.CreateRequest('products', productToIndex);
    logger.info('Product well indexed in elasticSearch');
    return productToIndex;
  } else {
    logger.error(`Invalid product data ${err.message}`);
    throw new Error(`Invalid product data ${err.message}`);
  }
};

module.exports = saveProduct;
