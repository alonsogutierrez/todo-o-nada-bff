const { format, parseISO } = require('date-fns');

const Order = require('../../../../db/models/order');
const Report = require('../../excel/useCases/Report');
const ReportMapper = require('../../excel/Mapper/betweenDates');

const logger = console;

const getSalesBetweenDates = async (startDate, endDate) => {
  const dateDBFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";
  const start = format(parseISO(startDate), dateDBFormat);
  const end = format(parseISO(endDate), dateDBFormat);
  logger.info(`Going to get sales between dates: ${start} and ${end}`);
  const orders = await Order.find(
    {
      'paymentData.state': 'paid',
      createdAt: {
        $gte: new Date(start),
        $lte: new Date(end).setDate(new Date().getDate() + 1),
      },
    },
    [],
    {
      sort: {
        createdAt: -1,
      },
    }
  ).exec();
  logger.info(`${orders.length} Orders founded`);
  const workBookFile = new Report(
    'Todo o Nada',
    orders,
    ReportMapper
  ).createReport();
  return workBookFile.xlsx.writeBuffer();
};

module.exports = getSalesBetweenDates;
