const searchProductsSchema = {
  title: 'QuerySchema',
  description:
    'describes properties required to search products by category, name and description',
  type: 'object',
  properties: {
    query: 'string',
    minLength: 2,
    maxLength: 100
  }
};

module.exports = searchProductsSchema;
