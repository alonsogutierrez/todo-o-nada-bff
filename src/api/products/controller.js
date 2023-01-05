const readXlsxFile = require('read-excel-file/node');
const path = require('path');
const Products = require('../../db/models/product');
const ElasticSearchRestData = require('../shared/infrastructure/ElasticSearchRESTData');
const product = require('../../db/models/product');

__dirname = path.resolve();
const logger = console;

const setProductsFromExcel = (excelProducts) => {
  let productsFromExcelMapped = [];
  excelProducts.shift();
  excelProducts.forEach((excelProduct) => {
    const [
      itemNumber,
      sku,
      name,
      description,
      categories,
      size,
      color,
      basePriceSales,
      basePriceReference,
      discount,
      stock,
      productSizeType,
      images,
    ] = excelProduct;
    const product = {
      itemNumber: `${itemNumber}`.trim(),
      sku,
      name,
      description: description === null ? '' : description,
      category: categories
        .split(',')
        .map((cat) => cat.toString().trim().toLowerCase()),
      size,
      color,
      price: {
        basePriceSales: parseInt(basePriceSales, 10),
        basePriceReference: parseInt(basePriceReference, 10),
        discount: parseInt(discount, 10),
      },
      stock,
      productSizeType,
      images,
    };
    productsFromExcelMapped.push(product);
  });
  return productsFromExcelMapped;
};

const updateProductSizes = (actualProductSizes, productSize) => {
  logger.info(
    'Updating product sizes in search repository',
    actualProductSizes,
    productSize
  );
  let newProductsSizes = [];
  newProductsSizes = actualProductSizes.includes(
    productSize.toString().trim().toUpperCase()
  )
    ? actualProductSizes
    : actualProductSizes.concat(productSize.toString().trim().toUpperCase());
  return newProductsSizes;
};

const updateProductDetails = (actualProductDetails, product) => {
  return {
    ...actualProductDetails,
    [product.sku]: {
      quantity: parseInt(product.stock, 10),
      size: product.size.toString().trim().toUpperCase(),
    },
  };
};

const processSearchRepository = async (product) => {
  try {
    const query = {
      match: {
        itemNumber: `${product.itemNumber}`,
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
    logger.info(
      'productFoundElasticRepository: ',
      JSON.stringify(productFoundElasticRepository)
    );
    if (body.hits && Object.keys(body.hits).length > 0) {
      const { total } = body.hits;
      if (total > 0) {
        const finalHits = body.hits.hits;
        const actualProduct = finalHits[0]._source;
        const newProductData = {
          ...actualProduct,
          name: product.name,
          categories: product.category,
          description: product.description,
          color: product.color,
          price: product.price,
          picture: product.images.split(',')[0],
          details: updateProductDetails(actualProduct.details, product),
          sizes: updateProductSizes(actualProduct.sizes, product.size),
          is_active: product.is_active,
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
        const newProductDetails = {};
        newProductDetails[product.sku] = {
          quantity: parseInt(product.stock, 10),
          size: product.size.toString().trim().toUpperCase(),
        };
        const newProduct = {
          itemNumber: `${product.itemNumber}`,
          name: product.name,
          categories: product.category,
          description: product.description,
          color: product.color,
          price: product.price,
          picture: product.images.split(',')[0],
          details: newProductDetails,
          sizes: [product.size.toString().trim().toUpperCase()],
          is_active: product.is_active,
        };
        await ElasticSearchRestData.CreateRequest('products', newProduct);
        logger.info(
          'Product well created in search repository',
          newProduct.itemNumber
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

const processProductRepository = async (product) => {
  try {
    const productFound = await Products.findOne({
      itemNumber: product.itemNumber,
    });

    if (productFound && Object.keys(productFound.length > 0)) {
      const skuFound = productFound.details.some(
        (subProduct) => subProduct.sku === parseInt(product.sku, 10)
      );
      if (skuFound) {
        const newProductDetails = productFound.details.map((subProduct) => {
          if (
            subProduct.sku.toString() ===
            product.sku.toString().trim().toUpperCase()
          ) {
            subProduct.size = product.size.toString().trim().toUpperCase();
            subProduct.stock = parseInt(product.stock, 10);
          }
          return subProduct;
        });
        const newProductData = {
          details: newProductDetails,
          name: product.name,
          description: product.description,
          category: product.category,
          pictures: product.images.split(','),
          price: {
            basePriceSales: product.price.basePriceSales,
            basePriceReference: product.price.basePriceSales,
            discount: product.price.discount,
          },
          color: product.color,
          productSizeType: product.productSizeType,
          is_active: product.is_active,
        };

        await Products.updateOne(
          { itemNumber: product.itemNumber },
          newProductData
        );
        logger.info(
          'Sub product sku well updated in product repository ',
          product.itemNumber,
          product.sku
        );
      } else {
        const newProductDetails = {
          sku: parseInt(product.sku, 10),
          size: product.size.toString().trim().toUpperCase(),
          stock: parseInt(product.stock, 10),
        };
        const newProductData = {
          name: product.name,
          description: product.description,
          category: product.category,
          color: product.color,
          price: product.price,
          pictures: product.images.split(','),
          details: productFound.details.concat(newProductDetails),
          productSizeType: product.productSizeType,
          is_active: product.is_active,
        };
        await Products.updateOne(
          { itemNumber: product.itemNumber },
          newProductData
        );
        logger.info(
          'Sub product sku well created in product repository ',
          product.itemNumber,
          product.sku
        );
      }
    } else {
      const newProduct = {
        itemNumber: product.itemNumber,
        category: product.category,
        name: product.name,
        description: product.description,
        price: product.price,
        color: product.color,
        pictures: [''],
        details: [
          {
            sku: parseInt(product.sku, 10),
            size: product.size.toString().trim().toUpperCase(),
            stock: parseInt(product.stock, 10),
          },
        ],
        productSizeType: product.productSizeType,
        is_active: product.is_active,
      };
      const p = new Products(newProduct);
      await p.save();
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

const uploadAndProcessLotsProducts = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send('Please upload an excel file!');
    }
    let path = __dirname + '/src/uploads/' + req.file.filename;
    let productsExcelMapped = [];
    let rows = [];
    try {
      logger.info('Going to read file');
      rows = await readXlsxFile(path);
      if (!rows) throw new Error(`There is not data: ${err.message}`);
    } catch (err) {
      throw new Error(`Error reading xlsx file: ${err.message}`);
    }
    logger.info('File well readed');

    productsExcelMapped = setProductsFromExcel(rows);

    try {
      logger.info('Procesaremos ', productsExcelMapped.length, ' productos');

      for (const excelProduct of productsExcelMapped) {
        logger.info('Processing actual product from excel: ', excelProduct);
        await processSearchRepository(excelProduct);
        await processProductRepository(excelProduct);
      }
      logger.info('All products well created in both repositories');
      return res
        .status(201)
        .send({ message: 'All products well created in both repositories' });
    } catch (err) {
      throw new Error(`Error processing batch products ${err.message}`);
    }
  } catch (err) {
    logger.error(
      `Could not upload the file: ${req.file.originalname}: ${err.message}`
    );
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}: ${err.message}`,
    });
  }
};

const findProductByItemNumber = async (req, res) => {
  try {
    const { itemNumber } = req.params;
    let product = await Products.findOne({
      itemNumber: parseInt(itemNumber),
    });
    const newProductDetails = {};
    product.details.forEach((p) => {
      newProductDetails[`${p.sku}`] = {
        size: p.size,
        stock: p.stock,
        _id: p._id,
      };
    });
    let productUpdated = {
      price: {},
      category: [],
      published: false,
      _id: '',
      itemNumber: 0,
      productSizeType: '',
      name: '',
      description: '',
      details: {},
      color: '',
      pictures: [],
      specifications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      is_active: true,
      __v: 0,
    };
    productUpdated.price = product.price;
    productUpdated.category = product.category;
    productUpdated.published = product.published;
    productUpdated._id = product._id;
    productUpdated.itemNumber = product.itemNumber;
    productUpdated.productSizeType = product.productSizeType;
    productUpdated.name = product.name;
    productUpdated.description = product.description;
    productUpdated.details = newProductDetails;
    productUpdated.color = product.color;
    productUpdated.pictures = product.pictures;
    productUpdated.specifications = product.specifications;
    productUpdated.createdAt = product.createdAt;
    productUpdated.updatedAt = product.updatedAt;
    productUpdated.is_active = product.is_active;
    productUpdated.__v = product.__v;
    logger.log(`Product with itemNumber :${itemNumber} find successfully`);
    res.status(200).send(productUpdated);
  } catch (e) {
    logger.error(
      `Can't find product: ${e.message} item: ${product.itemNumber}`
    );
    res.status(404).send();
  }
};

const findAllProducts = async (req, res) => {
  try {
    const { page } = req.query;
    const options = {
      limit: 1,
      pagination: true,
      page: page === isNaN(page) || page === undefined ? 1 : parseInt(page),
    };
    const products = await Products.paginate({}, options);
    logger.log('Products get successfully');
    res.status(201).send({ products });
  } catch (e) {
    logger.error('Can`t gets product: ', e.message);
    res.status(500).send({ status: false, error: e.message });
  }
};

const findProductsByParentCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page } = req.query;
    const options = {
      limit: 1,
      pagination: true,
      page: page === isNaN(page) || page === undefined ? 1 : parseInt(page),
    };
    const products = await Products.paginate(
      { 'category.0': category },
      options
    );
    logger.log('Products get successfully');
    res.status(201).send({ products });
  } catch (e) {
    logger.error('Can`t gets product: ', e.message);
    res.status(500).send({ status: false, error: e.message });
  }
};

const findProductsByParentChildCategory = async (req, res) => {
  try {
    const { category, childCategory } = req.params;
    const { page } = req.query;
    const options = {
      limit: 1,
      pagination: true,
      page: page === isNaN(page) || page === undefined ? 1 : parseInt(page),
    };
    const products = await Products.paginate(
      { 'category.1': childCategory, 'category.0': category },
      options
    );
    logger.log('Products get successfully');
    res.status(201).send({ products });
  } catch (e) {
    logger.error('Can`t gets product: ', e.message);
    res.status(500).send({ status: false, error: e.message });
  }
};

module.exports = {
  uploadAndProcessLotsProducts,
  findProductByItemNumber,
  findAllProducts,
  findProductsByParentCategory,
  findProductsByParentChildCategory,
};
