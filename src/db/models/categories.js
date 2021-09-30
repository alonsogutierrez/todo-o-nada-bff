const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema(
  {
    categories: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Categories = mongoose.model('Categories', categoriesSchema);

module.exports = Categories;
