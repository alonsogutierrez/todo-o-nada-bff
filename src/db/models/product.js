const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    sku: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
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
    quantity: {
      type: Number,
      required: true
    },
    pictures: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
