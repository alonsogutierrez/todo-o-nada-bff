const createUserSchema = {
  title: 'QuerySchema',
  description: 'describes properties required to create a user',
  type: 'object',
  properties: {
    mail: {
      type: 'string',
      description: 'user email',
    },
    password: {
      type: 'string',
      description: 'user email',
    },
  },
};

module.exports = createUserSchema;
