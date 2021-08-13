const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema(
  {
    category: [
      {
        required: true,
        type: 'String',
      },
    ],
    description: {
      required: true,
      type: 'String',
    },
    details: [
      {
        size: 'String',
        sku: {
          type: 'Number',
        },
        stock: 'Number',
      },
    ],
    pictures: [String],
    color: {
      required: true,
      type: 'String',
    },
    hasInventory: 'Boolean',
    hasSizes: 'Boolean',
    itemNumber: 'Number',
    name: {
      required: true,
      type: 'String',
    },
    price: {
      basePriceReference: {
        required: true,
        type: 'Number',
      },
      basePriceSales: {
        required: true,
        type: 'Number',
      },
      discount: {
        type: 'Number',
        default: 0,
      },
    },
    published: {
      default: false,
      type: 'Boolean',
    },
    quantity: 'Number',
    specifications: [
      {
        name: {
          type: 'String',
        },
        order: {
          type: 'Number',
        },
        value: {
          type: 'String',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(mongoosePaginate);
//productSchema.plugin(AutoIncrement, { inc_field: 'itemNumber' });

module.exports = mongoose.model('Product', productSchema);
