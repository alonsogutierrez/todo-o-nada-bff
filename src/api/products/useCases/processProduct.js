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
  try {
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
    const productFound = await Product.findOne({
      itemNumber: itemNumber,
    });

    if (productFound && Object.keys(productFound.length > 0)) {
      let skuFound = false;
      skuFound = productFound.details.some((subProduct) => {
        for (let sku in details) {
          if (sku === subProduct.sku) return true;
        }
      });
      if (skuFound) {
        const newProductDetails = productFound.details.map((subProduct) => {
          for (let sku in details) {
            if (sku === subProduct.sku) {
              subProduct.size = details[sku].size;
              subProduct.stock += parseInt(details[sku].stock, 10);
            }
          }
          return subProduct;
        });
        const newProductData = {
          details: newProductDetails,
          name: name,
          description: description,
          category: category,
          price: {
            basePriceSales: price.basePriceSales,
            basePriceReference: price.basePriceReference,
            discount: price.discount,
          },
          color: color,
        };

        await Product.updateOne({ itemNumber: itemNumber }, newProductData);
        logger.info(
          'Sub product sku well updated in product repository',
          itemNumber
        );
      } else {
        //Save sku's not found
        let skuNotFoundList = [];
        for (let sku in details) {
          let isSKUinProductFound = productFound.details.find((subProduct) => {
            if (sku !== subProduct.sku) {
              return true;
            }
          });
          if (!isSKUinProductFound) {
            skuNotFoundList.push(sku);
          }
        }
        skuNotFoundList.forEach((skuNotFound) => {
          let newProductDetails = {
            sku: parseInt(sku, 10),
            size: product.size,
            stock: parseInt(details[skuNotFound].stock, 10),
          };
          productFound.details.push(newProductDetails);
        });

        const newProductData = {
          name: name,
          description: description,
          category: category,
          color: color,
          price: price,
          details: productFound.details,
        };
        await Product.updateOne({ itemNumber: itemNumber }, newProductData);
        logger.info(
          'Sub product sku well created in product repository ',
          itemNumber
        );
      }
    } else {
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
      logger.info(
        'Product well created in product repository',
        product.itemNumber
      );
    }
    return;
  } catch (err) {
    logger.error(`Error trying to process product repository: ${err.message}`);
    throw new Error(err.message);
  }
  logger.info(
    'Trying to save product in MongoDB: ',
    JSON.stringify(productData)
  );

  logger.info('Product document well saved in MongoDB');
  return;
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
      sizes,
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

    const { hits } = productFoundElasticRepository;
    if (hits && Object.keys(hits).length > 0) {
      const { total } = hits;
      if (total > 0) {
        const finalHits = hits.hits;
        const actualProduct = finalHits[0]._source;
        const newProductData = {
          ...actualProduct,
          name: name,
          categories: category,
          description: description,
          color: color,
          price: price,
          details: details,
          sizes: getProductSizes(details),
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
      newProductsSizes.push(actualProductDetails[sku].size);
  }
  return newProductsSizes;
};

module.exports = processProduct;
