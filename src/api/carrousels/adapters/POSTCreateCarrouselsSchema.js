const createBannersSchema = {
  title: 'createCarrouselsSchema',
  description: 'describes properties required to create carrousels',
  type: 'object',
  properties: {
    products: {
      type: 'object',
      description: 'products carrousels',
    },
    carrousels: {
      type: 'object',
      description: 'object that contains all carrousels data',
    },
    carrouselsOrder: {
      type: 'array',
    },
  },
};

module.exports = createBannersSchema;
