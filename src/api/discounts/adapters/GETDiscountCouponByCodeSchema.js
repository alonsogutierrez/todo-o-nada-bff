const getDiscountCouponByCodeSchema = {
  title: 'GETDiscountCouponByCodeSchema',
  description: 'describes properties required to get a discount coupon by code',
  type: 'object',
  properties: {
    code: {
      type: 'string',
      description: 'code that identifies order associated to send email',
    },
  },
};

module.exports = getDiscountCouponByCodeSchema;
