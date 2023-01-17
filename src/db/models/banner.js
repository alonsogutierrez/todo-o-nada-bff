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
      },
    },
    position: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
