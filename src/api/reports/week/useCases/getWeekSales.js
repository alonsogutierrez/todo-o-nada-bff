const { format, subDays } = require('date-fns');

const Order = require('../../../../db/models/order');

const getWeekSales = async () => {
  const dateDBFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";
  const last7DatesFormat = 'yyyy-MM-dd';
  const todayDay = format(new Date(), dateDBFormat);
  const from7DaysBefore = format(subDays(new Date(), 6), last7DatesFormat);
  const lastDays = [0, 1, 2, 3, 4, 5, 6];
  const last7Dates = [];
  for (let i = 0; i < lastDays.length; i++) {
    last7Dates.push(format(subDays(new Date(), lastDays[i]), last7DatesFormat));
  }
  const orders = await Order.find(
    {
      'paymentData.state': 'created',
      createdAt: {
        $gte: new Date(from7DaysBefore),
        $lte: new Date(todayDay)
      }
    },
    [],
    {
      sort: {
        createdAt: 1
      }
    }
  ).exec();
  let responseWeekSales = initializeReponseObject(last7Dates);
  orders.forEach(order => {
    let actualOrderDay = format(order.createdAt, last7DatesFormat);
    const totalOrder =
      order.paymentData.transaction.subTotal +
      order.paymentData.transaction.shipping;
    //If this day exist in the response, then we add this total order inside it
    if (!responseWeekSales[actualOrderDay]) {
      responseWeekSales[last7Dates[last7Dates.length - 1]].y += totalOrder;
    } else {
      responseWeekSales[actualOrderDay].y += totalOrder;
    }
  });
  return responseWeekSales;
};

const initializeReponseObject = last7Dates => {
  const responseObject = {};
  last7Dates.forEach(date => {
    responseObject[date] = {
      x: date,
      y: 0
    };
  });
  return responseObject;
};

module.exports = getWeekSales;
