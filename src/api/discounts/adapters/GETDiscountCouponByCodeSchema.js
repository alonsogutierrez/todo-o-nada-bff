const getDiscountCouponSchema = {
  title: 'getDiscountCouponSchema',
  description: 'describes properties required to get a discount coupon',
  type: 'object',
  properties: {
    code: {
      type: 'string',
      description: 'code that identifies order associated to send email',
    },
  },
};

module.exports = getDiscountCouponSchema;
