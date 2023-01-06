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

const createProductInProductRepository = async (productData) => {
  const {
    itemNumber,
    name,
    category,
    productSizeType,
    description,
    color,
    price,
    details,
    pictures,
    is_active,
  } = productData;
  const categories = category.split(',');
  let newProductsDetails = [];

  for (let sku in details) {
    const newProductDetail = {};
    newProductDetail.size = details[sku].size.trim().toUpperCase();
    newProductDetail.sku = sku;
    newProductDetail.stock = details[sku].stock;
    newProductsDetails.push(newProductDetail);
  }

  const newProduct = {
    itemNumber,
    name,
    category: categories,
    productSizeType,
    description,
    details: newProductsDetails,
    pictures,
    color,
    hasInventory: true,
    hasSizes: true,
    price,
    is_active,
  };
  logger.info('Trying to save newProduct in MongoDB: ', productData);
  const product = new Product(newProduct);
  await product.save();
  logger.info('Product well created in product repository', product.itemNumber);
};

const updateProductInProductRepository = async (productData, productFound) => {
  const {
    itemNumber,
    name,
    category,
    productSizeType,
    description,
    color,
    price,
    details,
    pictures,
    is_active,
  } = productData;
  const categories = category.split(',');
  let newProductDetails = [];
  let newDetail = {};

  for (let sku in details) {
    newDetail = {
      size: details[sku].size.trim().toUpperCase(),
      stock: details[sku].stock,
      sku,
    };
    newProductDetails.push(newDetail);
  }

  let newProductData = {};
  newProductData = {
    name: name,
    description: description,
    category: categories,
    productSizeType,
    color: color,
    price: {
      basePriceSales: price.basePriceSales,
      basePriceReference: price.basePriceReference,
      discount: price.discount,
    },
    details: newProductDetails,
    is_active: is_active,
  };
  if (pictures && pictures.length > 0) {
    newProductData.pictures = pictures;
  }

  await Product.updateOne({ itemNumber: itemNumber }, newProductData);
  logger.info('Sub product sku well updated in product repository', itemNumber);
};

const processInProductRepository = async (productData) => {
  try {
    const { itemNumber } = productData;
    const productFound = await Product.findOne({
      itemNumber: itemNumber,
    });

    if (productFound && Object.keys(productFound.length > 0)) {
      return await updateProductInProductRepository(productData, productFound);
    }
    return await createProductInProductRepository(productData);
  } catch (err) {
    logger.error(`Error trying to process product repository: ${err.message}`);
    throw new Error(err.message);
  }
};

const processInSearchRepository = async (productData) => {
  try {
    const {
      itemNumber,
      name,
      category,
      description,
      color,
      price,
      details,
      pictures,
      is_active,
    } = productData;
    const query = {
      match: {
        itemNumber: `${itemNumber}`,
      },
    };
    const productFoundElasticRepository =
      await ElasticSearchRestData.SearchRequest(
        'products',
        { query },
        0,
        1,
        true
      );

    const { body } = productFoundElasticRepository;
    const newProductDetails = {};
    for (let sku in details) {
      newProductDetails[sku.toString()] = {
        quantity: parseInt(details[sku].stock, 10),
        size: details[sku].size.trim().toUpperCase(),
      };
    }
    if (body.hits && Object.keys(body.hits).length > 0) {
      const categories = category.split(',');
      const { total } = body.hits;
      if (total > 0) {
        const finalHits = body.hits.hits;
        const actualProduct = finalHits[0]._source;
        const newProductData = {
          ...actualProduct,
          name: name,
          categories,
          description: description,
          color: color,
          price: price,
          picture:
            pictures && pictures.length > 0 && pictures[0].length > 0
              ? pictures[0]
              : actualProduct.picture,
          details: newProductDetails,
          sizes: getProductSizes(newProductDetails),
          is_active: is_active,
        };
        await ElasticSearchRestData.UpdateRequest(
          'products',
          finalHits[0]._id,
          newProductData
        );
        logger.info(
          'Product well updated in search repository',
          newProductData.itemNumber
        );
      } else {
        let productToIndexSizes = [];
        for (let sku in newProductDetails) {
          if (newProductDetails[sku].quantity > 0) {
            productToIndexSizes.push(
              newProductDetails[sku].size.trim().toUpperCase()
            );
          }
        }

        const productToIndex = {
          itemNumber,
          name,
          categories,
          description,
          color,
          price,
          picture: pictures[0],
          details: newProductDetails,
          sizes: productToIndexSizes,
          is_active,
        };
        await ElasticSearchRestData.CreateRequest('products', productToIndex);
        logger.info(
          'Product well created in search repository',
          productToIndex.itemNumber
        );
      }
      return;
    } else {
      throw new Error('Error in elastic search, there is no hits in response');
    }
  } catch (err) {
    logger.error(`Error trying to process search repository: ${err.message}`);
    throw new Error(err.message);
  }
};

const getProductSizes = (actualProductDetails) => {
  let newProductsSizes = [];
  for (let sku in actualProductDetails) {
    if (actualProductDetails[sku].size)
      newProductsSizes.push(
        actualProductDetails[sku].size.trim().toUpperCase()
      );
  }
  return newProductsSizes;
};

module.exports = processProduct;
