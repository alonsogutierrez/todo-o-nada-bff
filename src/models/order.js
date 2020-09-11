const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      trim: true
    },
    products: [
      {
        name: String,
        category: String,
        sku: Number,
        description: String,
        specifications: [
          {
            name: String,
            order: Number,
            value: String
          }
        ],
        prices: [
          {
            BasePriceSales: Number,
            BasePriceReference: Number
          }
        ],
        hasInventory: Boolean
      }
    ],
    token: {
      type: String,
      required: true
    },
    inventoryState: {
      reserved: {
        status: String,
        products: [
          {
            sku: Number,
            quantity: Number
          }
        ]
      },
      confirmed: {
        status: String,
        products: [
          {
            sku: Number,
            quantity: Number
          }
        ]
      }
    },
    paymentData: {
      user: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: {
          country: String,
          city: String,
          commune: String,
          zip_code: String,
          address: String,
          num_address: String
        }
      },
      state: String,
      transaction: {
        date: Date,
        subTotal: Number,
        shipping: Number,
        id: Number
      }
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
