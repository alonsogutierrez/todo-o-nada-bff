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
        }
      }
    ],
    token: {
      type: String,
      required: true
    },
    inventoryState: {
      reserved: {
        status: {
          type: String
        },
        products: [
          {
            sku: {
              type: Number
            },
            quantity: {
              type: Number
            }
          }
        ]
      },
      confirmed: {
        status: {
          type: String
        },
        products: [
          {
            sku: {
              type: Number
            },
            quantity: {
              type: Number
            }
          }
        ]
      }
    },
    paymentData: {
      user: {
        firstName: {
          type: String,
          required: true
        },
        lastName: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true
        },
        phone: {
          type: String,
          required: true
        },
        address: {
          country: {
            type: String,
            required: true
          },
          city: {
            type: String,
            required: true
          },
          commune: {
            type: String,
            required: true
          },
          zip_code: {
            type: String,
            required: true
          },
          address: {
            type: String,
            required: true
          },
          num_address: {
            type: String,
            required: true
          }
        }
      },
      state: {
        type: String,
        required: true
      },
      transaction: {
        date: {
          type: Date,
          required: true
        },
        subTotal: {
          type: Number,
          required: true
        },
        shipping: {
          type: Number,
          required: true
        },
        id: {
          type: Number,
          required: true
        }
      }
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
