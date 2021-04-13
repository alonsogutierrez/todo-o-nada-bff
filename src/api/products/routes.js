const express = require('express');
const Products = require('../../db/models/product');
const saveProduct = require('./useCases/saveProduct');
const router = new express.Router();
const upload = require('../../middlewares/upload');
const controller = require('./controller');

const logger = console;

router.post(
  '/product/upload',
  upload.single('file'),
  controller.uploadAndProcessLotsProducts
);

router.post('/product', async (req, res) => {
  try {
    const productIndexed = await saveProduct(req.body);
    res.status(201).send({ status: 201, data: productIndexed });
  } catch (e) {
    logger.error('Can`t save product: ', e.message);
    res.status(500).send({ status: false, error: e.message });
  }
});

router.get('/product/itemNumber/:itemNumber', controller.findProductByItemNumber)
router.get('/product', controller.findAllProducts);


module.exports = router;
