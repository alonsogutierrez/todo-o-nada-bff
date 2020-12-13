const express = require('express');
const Product = require('../../../db/models/product')
const router = new express.Router();

const logger = console

router.post('/product', async (req, res) => {
    const product = new Product(req.body);
    logger.log('Order: ', order);
    try {
        await product.save()
        logger.log('Product saved successfully');
        res.status(201).send({ product })
    } catch (e) {
        logger.error('Can`t save product: ', e.message);
        res.status(500).send(e.message);
    }
})

module.exports = router;
