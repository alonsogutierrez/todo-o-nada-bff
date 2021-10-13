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
      productSizeType,
      description,
      color,
      price,
      details,
      pictures,
    } = productData;
    const productFound = await Product.findOne({
      itemNumber: itemNumber,
    });
    const categories = category.split(',');

    if (productFound && Object.keys(productFound.length > 0)) {
      let skuFound = false;
      skuFound = productFound.details.some(
        (subProduct) =>
          details[subProduct.sku.toString()] &&
          Object.keys(details[subProduct.sku.toString()]).length > 0
      );
      if (skuFound) {
        const newProductDetails = productFound.details.map((subProduct) => {
          if (
            details[subProduct.sku.toString()] &&
            Object.keys(details[subProduct.sku.toString()]).length > 0
          ) {
            subProduct.size = details[subProduct.sku.toString()].size;
            subProduct.stock = parseInt(
              details[subProduct.sku.toString()].stock,
              10
            );
          }
          return subProduct;
        });
        const newProductData = {
          details: newProductDetails,
          name: name,
          description: description,
          category: categories,
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
        for (let sku in details) {
          let isSKUinProductFound = productFound.details.find((subProduct) => {
            if (
              details[subProduct.sku.toString()] &&
              Object.keys(details[subProduct.sku.toString()]).length > 0
            ) {
              return true;
            }
          });
          if (!isSKUinProductFound) {
            let newProductDetails = {
              sku: parseInt(sku, 10),
              size: product.size,
              stock: parseInt(details[sku].stock, 10),
            };
            productFound.details.push(newProductDetails);
          }
        }

        const newProductData = {
          name: name,
          description: description,
          category: categories,
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
      let newProductsDetails = [];
      for (let sku in details) {
        const newProductDetail = {};
        newProductDetail.size = details[sku].size;
        newProductDetail.sku = sku;
        newProductDetail.stock = details[sku].stock;
        newProductsDetails.push(newProductDetail);
      }
      const newProduct = {
        itemNumber,
        name,
        category: category.split(','),
        productSizeType,
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
    const newProductDetails = {};
    for (let sku in details) {
      newProductDetails[sku.toString()] = {
        quantity: parseInt(details[sku].stock, 10),
        size: details[sku].size,
      };
    }
    if (hits && Object.keys(hits).length > 0) {
      const categories = category.split(',');
      const { total } = hits;
      if (total > 0) {
        const finalHits = hits.hits;
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
          categories,
          description,
          color,
          price,
          picture: pictures[0],
          details: newProductDetails,
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
