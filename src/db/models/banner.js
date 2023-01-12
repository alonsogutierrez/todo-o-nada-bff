const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    bannerNumber: {
      type: Number,
      required: true,
    },
    images: {
      desktop: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
    },
    position: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
