const mongoose = require('mongoose');

const carrouselSchema = new mongoose.Schema({
  id: {
    required: true,
    type: 'string',
  },
  title: {
    required: true,
    type: 'string',
  },
  products: [],
});

const productsSchema = new mongoose.Schema({
  _id: String,
  _source: {
    required: true,
    type: 'Object',
  },
});

const carrouselsConfigSchema = new mongoose.Schema(
  {
    products: {
      type: Map,
      of: productsSchema,
    },
    carrousels: {
      type: Map,
      of: carrouselSchema,
    },
    carrouselsOrder: [String],
  },
  {
    timestamps: true,
  }
);

const Carrousels = mongoose.model('Carrousels', carrouselsConfigSchema);

module.exports = Carrousels;
