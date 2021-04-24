const readXlsxFile = require('read-excel-file/node');
const path = require('path');
const Products = require('../../db/models/product');

const ElasticSearchRestData = require('../shared/infrastructure/ElasticSearchRESTData');

__dirname = path.resolve();
const logger = console;

const uploadAndProcessLotsProducts = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send('Please upload an excel file!');
    }
    let path = __dirname + '/src/uploads/' + req.file.filename;
    const productsFromExcel = [];
    await readXlsxFile(path).then(rows => {
      rows.shift();
      rows.forEach(row => {
        const [
          itemNumber,
          sku,
          name,
          description,
          categories,
          size,
          color,
          basePriceSales,
          BasePriceReference,
          discount,
          stock
        ] = row;
        const product = {
          name,
          description: description === null ? '' : description,
          category: categories.split(','),
          size,
          color,
          sku,
          itemNumber,
          price: {
            BasePriceSales: parseInt(basePriceSales),
            BasePriceReference: parseInt(BasePriceReference),
            discount: parseInt(discount)
          },
          stock
        };
        productsFromExcel.push(product);
      });
    });
    logger.log('Procesaremos ', productsFromExcel.length, ' productos');
    for (const product of productsFromExcel) {
      const query = {
        bool: {
          must: [
            {
              match: {
                itemNumber: product.itemNumber
              }
            },
            {
              match: {
                sku: product.sku
              }
            }
          ]
        }
      };
      const productFoundElasticRepository = await ElasticSearchRestData.SearchRequest(
        'products',
        'product',
        { query }
      );
      const { hits } = productFoundElasticRepository;
      if (hits) {
        const { total } = hits;
        const { value } = total;
        if (value > 0) {
          const finalHits = hits.hits;
          const actualProduct = finalHits[0]._source;
          const newProductData = {
            ...actualProduct,
            name: product.name,
            categories: product.category,
            description: product.description,
            colors: product.color,
            sizeDetail: product.size,
            price: product.price,
            quantity: Number(actualProduct.quantity) + Number(product.quantity)
          };

          await ElasticSearchRestData.UpdateRequest(
            'products',
            'product',
            finalHits[0]._id,
            newProductData
          );
        } else {
          const newProduct = {
            itemNumber: product.itemNumber,
            sku: product.sku,
            name: product.name,
            categories: product.category,
            description: product.description,
            colors: product.color,
            sizeDetail: product.size,
            price: product.price,
            quantity: product.stock
          };
          await ElasticSearchRestData.CreateRequest(
            'products',
            'product',
            newProduct
          );
        }
      } else {
        throw new Error(
          'Error in elastic search, there is no hits in response'
        );
      }

      const productFound = await Products.findOne({
        itemNumber: product.itemNumber
      });
      if (productFound) {
        const skuFound = productFound.details.find(
          subProduct => subProduct.sku === product.sku
        );
        if (skuFound) {
          const newProductDetails = productFound.details.map(subProduct => {
            if (subProduct.sku === product.sku) {
              subProduct.color = product.color;
              subProduct.size = product.size;
              subProduct.stock += Number(product.stock);
            }
            return subProduct;
          });
          const newProductData = {
            details: newProductDetails,
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price
          };

          const doc = await Products.updateOne(
            { itemNumber: product.itemNumber },
            newProductData
          );
        } else {
          const newProductDetails = {
            sku: product.sku,
            color: product.color,
            size: product.size,
            stock: product.stock
          };
          const newProductData = {
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            details: productFound.details.concat(newProductDetails)
          };
          const doc = await Products.updateOne(
            { itemNumber: product.itemNumber },
            newProductData
          );
        }
      } else {
        const newProduct = {
          itemNumber: product.itemNumber,
          category: product.category,
          name: product.name,
          description: product.description,
          price: product.price,
          details: [
            {
              sku: product.sku,
              color: product.color,
              size: product.size,
              stock: product.stock
            }
          ]
        };
        const p = new Products(newProduct);
        await p.save();
      }
    }
    return res.sendStatus(201);
  } catch (error) {
    logger.log(error);
    res.status(500).send({
      message: 'Could not upload the file: ' + req.file.originalname
    });
  }
};

const findProductByItemNumber = async (req, res) => {
  try {
    const { itemNumber } = req.params;
    const product = await Products.findOne({
      itemNumber: parseInt(itemNumber)
    });
    logger.log(`Product with itemNumber :${itemNumber} find successfully`);
    res.status(200).send(product);
  } catch (e) {
    logger.error('Can`t find product: ', e.message);
    res.status(404).send();
  }
};

const findAllProducts = async (req, res) => {
  try {
    const { page } = req.query;
    const options = {
      limit: 1,
      pagination: true,
      page: page === isNaN(page) || page === undefined ? 1 : parseInt(page)
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
      page: page === isNaN(page) || page === undefined ? 1 : parseInt(page)
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
      page: page === isNaN(page) || page === undefined ? 1 : parseInt(page)
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
  findProductsByParentChildCategory
};
