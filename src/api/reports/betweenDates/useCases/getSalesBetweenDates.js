const { format, parseISO } = require('date-fns');

const Order = require('../../../../db/models/order');
const Report = require('../../excel/useCases/Report');
const ReportMapper = require('../../excel/Mapper/betweenDates');

const getSalesBetweenDates = async (startDate, endDate) => {
  const dateDBFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";
  const start = format(parseISO(startDate), dateDBFormat);
  const end = format(parseISO(endDate), dateDBFormat);
  const orders = await Order.find(
    {
      'paymentData.state': 'paid',
      createdAt: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    },
    [],
    {
      sort: {
        createdAt: -1
      }
    }
  ).exec();
  const workBookFile = new Report(
    'Todo o Nada',
    orders,
    ReportMapper
  ).createReport();
  return workBookFile.xlsx.writeBuffer();
};

module.exports = getSalesBetweenDates;
