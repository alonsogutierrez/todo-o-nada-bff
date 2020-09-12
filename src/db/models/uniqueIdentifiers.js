const mongoose = require('mongoose');

module.exports = mongoose.model(
  'uniqueIdentifiers',
  new mongoose.Schema(
    {
      count: {
        type: Number,
        required: true,
        unique: false
      },
      description: {
        type: String,
        required: true,
        unique: false
      }
    },
    {
      collection: 'uniqueIdentifiers',
      strict: false
    }
  )
);
