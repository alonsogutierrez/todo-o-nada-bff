const productSchema = {
  title: 'NewProduct',
  description: 'describes properties required to create a product',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'product name'
    },
    category: {
      type: 'array',
      items: {
        name: { type: 'string' }
      },
      description: 'product categories'
    },
    itemNumber: {
      type: 'number',
      description: 'product item number'
    },
    description: {
      type: 'string',
      description: 'product description'
    },
    details: {
      type: 'array',
      items: {
        sku: { type: 'number' },
        color: { type: 'string' },
        size: { type: 'string' },
        stock: { type: 'number' },
        pictures: {
          type: 'array',
          item: {
            image: { type: 'string' },
            order: { type: 'number' }
          }
        }
      }
    },
    specifications: {
      type: 'array',
      items: {
        name: { type: 'string' },
        order: { type: 'number' },
        value: { type: 'string' }
      }
    },
    prices: {
      type: 'object',
      properties: {
        BasePriceSales: { type: 'number' },
        BasePriceReference: { type: 'number' },
        discount: { type: 'number' }
      }
    },
    quantity: { type: 'number' },
    published: {
      type: 'boolean'
    },
    hasSizes: { type: 'boolean' },
    hasInventory: { type: 'boolean' }
  },
  required: [
    'name',
    'category',
    'itemNumber',
    'description',
    'details',
    'specifications',
    'prices',
    'quantity',
    'published',
    'hasSizes',
    'hasInventory'
  ]
};

module.exports = productSchema;
