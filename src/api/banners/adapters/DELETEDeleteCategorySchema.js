const eraseBannersSchema = {
  title: 'deleteBannersSchema',
  description: 'describes properties required to erase banners',
  type: 'object',
  properties: {
    bannerNumber: {
      type: 'number',
      description: 'code that identifies each banner',
    },
  },
};

module.exports = eraseBannersSchema;
