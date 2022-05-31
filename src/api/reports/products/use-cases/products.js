const { format, parseISO } = require('date-fns');

const Product = require('../../../../db/models/product');
const Report = require('../../excel/useCases/ProductReport');
const ReportMapper = require('../../excel/Mapper/downloadProducts');

const logger = console;

const downloadProducts = async () => {
  logger.info(`Going to download products`);
  const products = await Product.find({}, [], {
    sort: {
      createdAt: -1,
    },
  }).exec();
  logger.info(`${products.length} Products founded`);
  const workBookFile = new Report(
    'Todo o Nada Products',
    products,
    ReportMapper
  ).createReport();
  return workBookFile.xlsx.writeBuffer();
};

module.exports = downloadProducts;
