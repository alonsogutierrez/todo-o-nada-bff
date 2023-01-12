const createBannersSchema = {
  title: 'createBannersSchema',
  description: 'describes properties required to create banners',
  type: 'object',
  properties: {
    bannerNumber: {
      type: 'number',
      description: 'code that identifies each banner',
    },
    images: {
      type: 'object',
      description: 'images for desktop and mobile',
    },
    position: {
      type: 'number',
      description: 'position of the banner in home',
    },
    isActive: {
      type: 'boolean',
      description: 'boolean value to check if banner is visibile',
    },
  },
};

module.exports = createBannersSchema;
