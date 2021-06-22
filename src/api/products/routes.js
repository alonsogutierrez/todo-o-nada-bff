const express = require('express');
const saveProduct = require('./useCases/saveProduct');
const router = new express.Router();
const uploadFileToServer = require('../../middlewares/uploadFileToServer');
const uploadS3 = require('../../middlewares/uploadS3');
const controller = require('./controller');

const logger = console;

router.post(
  '/product/upload',
    uploadFileToServer.single('file'),
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

router.post('/product/uploadImage', uploadS3.uploadImagesS3)
router.get('/product', controller.findAllProducts);
router.get('/product/itemNumber/:itemNumber', controller.findProductByItemNumber)
router.get('/product/category/:category', controller.findProductsByParentCategory)
router.get('/product/category/:category/:childCategory', controller.findProductsByParentChildCategory)


module.exports = router;
