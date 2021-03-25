const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: [
            {
                type: String,
                required: true
            }
        ],
        itemNumber: Number,
        description: {
            type: String,
            required: true
        },
        details: [
            {
                sku: {
                    type: Number,
                    required: false
                },
                color: {
                    type: String,
                    required: false
                },
                size: String,
                stock: Number,
                pictures: {
                    image: String,
                    order: Number
                }
            }
        ],
        specifications: [
            {
                name: {
                    type: String
                },
                order: {
                    type: Number
                },
                value: {
                    type: String
                }
            }
        ],
        price: {
            BasePriceSales: {
                type: Number,
                required: true
            },
            BasePriceReference: {
                type: Number,
                required: true
            },
            discount: {
                type: Number,
                required: false
            }
        },
        quantity: Number,
        published: {
            type: Boolean,
            default: false
        },
        hasSizes: Boolean,
        hasInventory: Boolean
    },
    {
        timestamps: true
    }
);

productSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Product', productSchema);
