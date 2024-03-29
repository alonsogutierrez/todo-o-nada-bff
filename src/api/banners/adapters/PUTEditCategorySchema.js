const editBannersSchema = {
  title: 'editBannersSchema',
  description: 'describes properties required to edit banners',
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

module.exports = editBannersSchema;
