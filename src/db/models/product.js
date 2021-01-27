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
            name: {
                type: String,
                required: true
            },
            code: {
                type: String,
                required: true
            }
        }
    ],
    sku: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    sizes: [
        {
            name: {
                type: String,
                required: true
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
    prices: [
      {
        BasePriceSales: {
          type: Number,
          required: true
        },
        BasePriceReference: {
          type: Number,
          required: true
        }
      }
    ],
    hasInventory: {
      type: Boolean
    },
    hasSizes: {
      type: Boolean
    },
    quantity: {
      type: Number,
      required: true
    },
    pictures: [
        {
            image: {
                type: String,
                required: true
            },
            priority: {
                type: Number,
                required: true
            }
        }
    ]
  },
  {
    timestamps: true
  }
);

productSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Product', productSchema);
