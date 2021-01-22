const express = require('express');
const Product = require('../../../db/models/product')
const router = new express.Router();

const logger = console

router.post('/product', async (req, res) => {
    const product = new Product(req.body);
    try {
        await product.save()
        logger.log('Product saved successfully');
        res.status(201).send({ status: true , data: product })
    } catch (e) {
        logger.error('Can`t save product: ', e.message);
        res.status(500).send({status: false, error: e.message});
    }
})

router.get('/product', async (req, res) => {
    try {
        const products = await Product.find({})
        logger.log('Products get successfully');
        res.status(201).send({ status: true , data: products })
    } catch (e) {
        logger.error('Can`t gets product: ', e.message);
        res.status(500).send({status: false, error: e.message});
    }
})

router.get('/product/:sku', async (req, res) => {
    try {
        const { sku } = req.params
        const product = await Product.findOne({sku: parseInt(sku)})
        logger.log(`Product with sku :${sku} find successfully`);
        res.status(201).send({ status: true , data: product })
    } catch (e) {
        logger.error('Can`t gets product: ', e.message);
        res.status(500).send({status: false, error: e.message});
    }
})

router.put('/product/:sku', async (req, res) => {
    try {
        const { sku } = req.params
        const updateProduct = new Product(req.body);
        const product = await Product.findOneAndUpdate({sku: parseInt(sku)}, updateProduct)
        logger.log(`Product with sku :${sku} update successfully`);
        res.status(201).send({ status: true , data: product })
    } catch (e) {
        logger.error('Can`t gets product: ', e.message);
        res.status(500).send({status: false, error: e.message});
    }
})

module.exports = router;