const Product = require('../../../db/models/product');
const ElasticSearchRestData = require('../../shared/infrastructure/ElasticSearchRESTData');

const logger = console;

const processProduct = async (productInput) => {
  await Promise.all([
    processInProductRepository(productInput),
    processInSearchRepository(productInput),
  ]);
  return productInput;
};

const processInProductRepository = async (productData) => {
  logger.info(
    'Trying to save product in MongoDB: ',
    JSON.stringify(productData)
  );
  const {
    itemNumber,
    name,
    category,
    description,
    color,
    price,
    details,
    sizes,
    pictures,
  } = productData;
  let newProductsDetails = [];
  for (let sku in details) {
    const newProductDetail = {};
    newProductDetail.size = details[sku].size;
    newProductDetail.sku = sku;
    newProductDetail.stock = details[sku].quantity;
    newProductsDetails.push(newProductDetail);
  }
  const newProduct = {
    itemNumber,
    name,
    category: category.split(','),
    description,
    details: newProductsDetails,
    pictures,
    color,
    hasInventory: true,
    hasSizes: true,
    price,
  };
  logger.info('Trying to save newProduct in MongoDB: ', productData);

  const product = new Product(newProduct);
  await product.save();
  logger.info('Product document well saved in MongoDB');
  return;
};

const processInSearchRepository = async (productData) => {
  const {
    itemNumber,
    name,
    category,
    description,
    color,
    price,
    details,
    sizes,
  } = productData;

  let productToIndexSizes = [];

  for (let sku in details) {
    if (details[sku].quantity > 0) {
      productToIndexSizes.push(details[sku].size);
    }
  }

  const productToIndex = {
    itemNumber,
    name,
    categories: category,
    description,
    color,
    price,
    picture: `${process.env.S3_BASE_URL}/images/products/${itemNumber}.jpg`,
    details,
    sizes: productToIndexSizes,
  };
  logger.info('Trying to save product document in elasticSearch');
  await ElasticSearchRestData.CreateRequest('products', productToIndex);
  logger.info('Product well indexed in elasticSearch');
  return;
};

module.exports = processProduct;
