const readXlsxFile = require("read-excel-file/node");
const path = require('path')
const Products = require('../../db/models/product')

__dirname = path.resolve();

const uploadAndProcessLotsProducts = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload an excel file!");
        }
        let path = __dirname + "/src/uploads/" + req.file.filename;
        const productsFromExcel = []
        await readXlsxFile(path).then((rows) => {
            rows.shift();
            rows.forEach((row) => {
                const [ itemNumber, sku, name, description, categories, size, color, basePriceSales, BasePriceReference, discount, stock ] = row
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
                }
                productsFromExcel.push(product)
            })
        });
        for (const product of productsFromExcel) {
            const productFound = await Products.findOne({itemNumber: product.itemNumber})
            if (productFound) {
                const skuFound = productFound.details.find(subProduct => subProduct.sku === product.sku)
                if (skuFound) {
                    const newProductDetails = productFound.details.map((subProduct) => {
                        if (subProduct.sku === product.sku) {
                            subProduct.color = product.color
                            subProduct.size = product.size
                            subProduct.stock = product.stock
                        }
                        return subProduct
                    })
                    const productToUpdated = {
                        details: newProductDetails,
                        name: product.name,
                        description: product.description,
                        category: product.category,
                        price: product.price
                    }

                    const doc = await Products.updateOne({itemNumber: product.itemNumber}, productToUpdated)
                    console.log('doc', doc)
                }
                if (skuFound === undefined) {
                    const newSku = {sku: product.sku, color: product.color, size: product.size, stock: product.stock }
                    const productToUpdated = {
                        name: product.name,
                        description: product.description,
                        category: product.category,
                        price: product.price,
                        details: productFound.details.concat(newSku)
                    }
                    const doc = await Products.updateOne({itemNumber: product.itemNumber}, productToUpdated)
                    console.log('doc', doc)
                }
            }

            if (productFound === null) {
                const newProduct = {
                    itemNumber: product.itemNumber,
                    category: product.category,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    details: [
                        {sku: product.sku, color: product.color, size: product.size, stock: product.stock }
                    ]
                }
                const p = new Products(newProduct)
                await p.save()
            }
        }
        return res.sendStatus(201)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};

module.exports = {
    uploadAndProcessLotsProducts
}
