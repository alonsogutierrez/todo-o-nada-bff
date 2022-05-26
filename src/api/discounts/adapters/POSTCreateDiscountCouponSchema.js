const createDiscountCouponSchema = {
  title: 'CreateDiscountCouponSchema',
  description: 'describes properties required to create a discount coupon',
  type: 'object',
  properties: {
    code: {
      type: 'string',
      description: 'code that identifies order associated to send email',
    },
    isPercentual: {
      type: 'boolean',
      description:
        'boolean value that defines if the discount is percentual or only amount',
    },
    amount: {
      type: 'number',
      description:
        'amount of discount in percentaje or amount if is percentual is off',
    },
    expireDate: {
      type: 'date',
      description: 'date of promotion discount coupon ends',
    },
    isActive: {
      type: 'boolean',
      description:
        'boolean value that defines is the discount coupon is active or not',
    },
  },
};

module.exports = createDiscountCouponSchema;
