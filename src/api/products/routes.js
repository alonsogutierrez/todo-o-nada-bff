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

router.post('/product', uploadS3.uploadImagesS3, async (req, res) => {
  try {
    const { locationArray } = req.imagesS3Service;
    const newProduct = {...req.body, pictures: locationArray,
      details: JSON.parse(req.body.details),
      price: JSON.parse(req.body.price),
      category: JSON.parse(req.body.category)
    }
    const productIndexed = await saveProduct(newProduct);
    res.status(201).send({ status: 201, data: productIndexed });
  } catch (e) {
    logger.error('Can`t save product: ', e.message);
    res.status(500).send({ status: false, error: e.message });
  }
});

router.get('/product', controller.findAllProducts);
router.get('/product/itemNumber/:itemNumber', controller.findProductByItemNumber)
router.get('/product/category/:category', controller.findProductsByParentCategory)
router.get('/product/category/:category/:childCategory', controller.findProductsByParentChildCategory)


module.exports = router;
