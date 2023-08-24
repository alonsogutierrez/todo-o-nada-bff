const createBannersSchema = {
  title: 'createCarrouselsSchema',
  description: 'describes properties required to create carrousels',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      description: 'code that identifies each carrousels',
    },
    _source: {
      type: 'object',
      description: 'object that contains all carrousel data',
    },
  },
};

module.exports = createBannersSchema;
