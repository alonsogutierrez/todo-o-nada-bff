const express = require('express');
const processProduct = require('./useCases/processProduct');
const auth = require('./../../middlewares/auth');
const uploadFileToServer = require('../../middlewares/uploadFileToServer');
const uploadS3 = require('../../middlewares/uploadS3');
const controller = require('./controller');

const router = new express.Router();
const logger = console;

router.post(
  '/product/upload',
  [auth, uploadFileToServer.single('file')],
  controller.uploadAndProcessLotsProducts
);

router.post('/product', [auth, uploadS3.uploadImagesS3], async (req, res) => {
  try {
    logger.info('Begin to create product');
    const { locationArray } = req.imagesS3Service;
    const newProduct = {
      ...req.body,
      pictures: locationArray,
      price: JSON.parse(req.body.price),
      details: JSON.parse(req.body.details),
    };
    const productIndexed = await processProduct(newProduct);
    logger.info('Product well created');
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
