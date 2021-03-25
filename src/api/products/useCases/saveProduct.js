const elasticSearch = require('elasticsearch');
const logger = console;

const elasticSearchUrl = process.env.ELASTIC_SEARCH_URL;

const saveProduct = async product => {
  // TODO: Change isValidProduct by Schema Validator
  if (isValidProduct(product)) {
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
      itemNumber: product.itemNumber,
      name: product.name,
      categories: product.category.map(category => category.name)
    };
    await elasticSearchClient.index({
      index: 'products',
      type: 'product',
      body: productToIndex
    });
    logger.log('Product well indexed in elasticSearch');
  } else {
    logger.error('Product invalid');
    throw new Error('Invalid product data');
  }
};

const isValidProduct = product => {
  const {
    name,
    category,
    itemNumber,
    sku,
    description,
    sizes,
    prices,
    quantity,
    pictures
  } = product;
  logger.log('Begin validation product');
  //TODO: Change return false by a message
  if (!name) {
    logger.error('isValidProduct: Invalid name');
    return false;
  }
  if (!category) {
    logger.error('isValidProduct: Invalid category');
    return false;
  } else {
    if (category.length > 0) {
      category.forEach(cat => {
        const { name, code } = cat;
        if (!name) {
          logger.error('isValidProduct: Invalid category name');
          return false;
        }
        if (!code) {
          logger.error('isValidProduct: Invalid category code');
          return false;
        }
      });
    } else {
      logger.error('isValidProduct: Invalid category array');
      return false;
    }
  }
  if (!itemNumber) {
    logger.error('isValidProduct: Invalid itemNumber');
    return false;
  }
  if (!sku) {
    logger.error('isValidProduct: Invalid sku');
    return false;
  }
  if (!description) {
    logger.error('isValidProduct: Invalid description');
    return false;
  }
  if (!sizes) {
    logger.error('isValidProduct: Invalid sizes');
    return false;
  }
  if (!prices) {
    logger.error('isValidProduct: Invalid prices');
    return false;
  } else {
    if (prices.length > 0) {
      prices.forEach(p => {
        const { BasePriceSales, BasePriceReference } = p;
        if (!BasePriceSales) {
          logger.error('isValidProduct: Invalid prices BasePriceSales');
          return false;
        }
        if (!BasePriceReference) {
          logger.error('isValidProduct: Invalid prices BasePriceReference');
          return false;
        }
      });
    } else {
      logger.error('isValidProduct: Invalid prices array');
      return false;
    }
  }
  if (!quantity) {
    logger.error('isValidProduct: Invalid quantity');
    return false;
  }
  if (!pictures) {
    logger.error('isValidProduct: Invalid pictures');
    return false;
  } else {
    if (pictures.length > 0) {
      pictures.forEach(pic => {
        const { image, priority } = pic;
        if (!image) {
          logger.error('isValidProduct: Invalid pictures image');
          return false;
        }
        if (!priority) {
          logger.error('isValidProduct: Invalid pictures priority');
          return false;
        }
      });
    } else {
      logger.error('isValidProduct: Invalid pictures array');
      return false;
    }
  }
  logger.log('Product valid');
  return true;
};

module.exports = saveProduct;
