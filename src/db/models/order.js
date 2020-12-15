const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: Number,
            required: true
        },
        products: [
            {
                name: {
                    type: String,
                    required: true
                },
                sku: {
                    type: Number,
                    required: true
                },
                prices: [
                    {
                        basePriceSales: {
                            type: Number,
                            required: true
                        },
                        basePriceReference: {
                            type: Number,
                            required: true
                        },
                        discount: {
                            type: Number
                        }
                    }
                ],
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        inventoryState: {
            reserved: {
                status: {
                    type: String // confirmed, reserved, cancel
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
                        type: String
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
                type: String, // created, paid, cancel
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
