const getOrderByOrderNumberSchema = {
  title: 'GETOrderByOrderNumberSchema',
  description: 'describes properties required to an order by order number',
  type: 'object',
  properties: {
    orderNumber: {
      type: 'string',
      description: 'order number',
    },
  },
};

module.exports = getOrderByOrderNumberSchema;
