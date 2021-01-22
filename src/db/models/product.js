const mongoose = require('mongoose');

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

module.exports = mongoose.model('Product', productSchema);
