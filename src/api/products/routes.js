const express = require('express');

const saveProduct = require('./useCases/saveProduct');
const auth = require('./../../middlewares/auth');
const upload = require('../../middlewares/upload');
const controller = require('./controller');

const router = new express.Router();
const logger = console;

router.post(
  '/product/upload',
  [auth, upload.single('file')],
  controller.uploadAndProcessLotsProducts
);

router.post('/product', auth, async (req, res) => {
  try {
    const productIndexed = await saveProduct(req.body);
    res.status(201).send({ status: 201, data: productIndexed });
  } catch (e) {
    logger.error('Can`t save product: ', e.message);
    res.status(500).send({ status: false, error: e.message });
  }
});

router.get('/product', controller.findAllProducts);
router.get(
  '/product/itemNumber/:itemNumber',
  controller.findProductByItemNumber
);
router.get(
  '/product/category/:category',
  controller.findProductsByParentCategory
);
router.get(
  '/product/category/:category/:childCategory',
  controller.findProductsByParentChildCategory
);

module.exports = router;
