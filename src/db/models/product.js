const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema(
  {
    category: [
      {
        required: true,
        type: 'String'
      }
    ],
    description: {
      required: true,
      type: 'String'
    },
    details: [
      {
        color: {
          required: false,
          type: 'String'
        },
        pictures: [
          {
            image: 'String',
            order: 'Number'
          }
        ],
        size: 'String',
        sku: {
          required: false,
          type: 'Number'
        },
        stock: 'Number'
      }
    ],
    hasInventory: 'Boolean',
    hasSizes: 'Boolean',
    itemNumber: 'Number',
    name: {
      required: true,
      type: 'String'
    },
    price: {
      BasePriceReference: {
        required: true,
        type: 'Number'
      },
      BasePriceSales: {
        required: true,
        type: 'Number'
      },
      discount: {
        required: false,
        type: 'Number'
      }
    },
    published: {
      default: false,
      type: 'Boolean'
    },
    quantity: 'Number',
    specifications: [
      {
        name: {
          type: 'String'
        },
        order: {
          type: 'Number'
        },
        value: {
          type: 'String'
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
