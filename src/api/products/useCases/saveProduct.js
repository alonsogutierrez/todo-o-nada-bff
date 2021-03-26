const elasticSearch = require('elasticsearch');
const { validate } = require('json-schema');

const productSchema = require('../schema/product');
const Product = require('../../../db/models/product');

const logger = console;
const elasticSearchUrl = process.env.ELASTIC_SEARCH_URL;

const saveProduct = async productInput => {
  if (validate(productInput, productSchema)) {
    const product = new Product(productInput);
    logger.log('Trying to save product');
    await product.save();
    logger.log('Product saved successfully');

    logger.log('Initalizing elasticSearch client');
    const elasticSearchClient = new elasticSearch.Client({
      host: elasticSearchUrl
    });
    const elasticProductIndex = await elasticSearchClient.indices.exists({
      index: 'products'
    });
    if (!elasticProductIndex) {
      logger.log('Trying to create elasticSearch index');
      await elasticSearchClient.indices.create({
        index: 'products',
        includeTypeName: true,
        body: {
          mappings: {
            properties: {
              name: {
                type: 'text'
              },
              categories: {
                type: 'array'
              }
            }
          }
        }
      });
      logger.log('Index created');
    }
    const productToIndex = {
      name: product.name,
      categories: product.category.map(category => category.name),
      description: product.description,
      colors: product.details.map(detail => detail.color),
      sizeDetail: product.details.map(detail => detail.size)
    };
    await elasticSearchClient.index({
      index: 'products',
      type: 'product',
      body: productToIndex
    });
    logger.log('Product well indexed in elasticSearch');
    return productToIndex;
  } else {
    logger.error('Product invalid');
    throw new Error('Invalid product data');
  }
};

module.exports = saveProduct;
