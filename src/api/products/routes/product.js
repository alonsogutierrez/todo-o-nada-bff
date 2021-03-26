const express = require('express');
const Product = require('../../../db/models/product');
const saveProduct = require('../useCases/saveProduct');
const router = new express.Router();

const logger = console;

router.post('/product', async (req, res) => {
  try {
    const productIndexed = await saveProduct(req.body);
    res.status(201).send({ status: 201, data: productIndexed });
  } catch (e) {
    logger.error('Can`t save product: ', e.message);
    res.status(500).send({ status: false, error: e.message });
  }
});

router.get('/product', async (req, res) => {
  try {
    const { page } = req.query;
    const options = {
      limit: 1,
      pagination: true,
      page: page === isNaN(page) || page === undefined ? 1 : parseInt(page)
    };
    const products = await Product.paginate({}, options);
    logger.log('Products get successfully');
    res.status(201).send({ products });
  } catch (e) {
    logger.error('Can`t gets product: ', e.message);
    res.status(500).send({ status: false, error: e.message });
  }
});

router.get('/product/sku/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    const product = await Product.findOne({ sku: parseInt(sku) });
    logger.log(`Product with sku :${sku} find successfully`);
    res.status(201).send({ status: true, data: product });
  } catch (e) {
    logger.error('Can`t gets product: ', e.message);
    res.status(500).send({ status: false, error: e.message });
  }
});

router.put('/product/sku/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    const updateProduct = new Product(req.body);
    const product = await Product.findOneAndUpdate(
      { sku: parseInt(sku) },
      updateProduct
    );
    logger.log(`Product with sku :${sku} update successfully`);
    res.status(201).send({ status: true, data: product });
  } catch (e) {
    logger.error('Can`t gets product: ', e.message);
    res.status(500).send({ status: false, error: e.message });
  }
});

router.get('/product/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const product = await Product.find({ 'category.code': String(category) });
    logger.log(`Product with category :${category} update successfully`);
    res.status(201).send({ status: true, data: product });
  } catch (e) {
    logger.error('Can`t gets product: ', e.message);
    res.status(500).send({ status: false, error: e.message });
  }
});

module.exports = router;
