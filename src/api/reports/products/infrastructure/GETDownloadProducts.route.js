const HTTPCodes = require('http-status-codes');
const downloadProducts = require('../use-cases/products');
const isValidQuery = require('../adapters/GETDownloadProductsRequestValidation.validation');

const logger = console;

const action = async (req, res) => {
  try {
    const query = req.query;
    if (!isValidQuery({ query })) {
      res.status(HTTPCodes.StatusCodes.BAD_REQUEST).send({
        error: 'Invalid params',
      });
      return;
    }
    logger.log('Beginning to dowload products');
    const downloadProductsBuffer = await downloadProducts();
    const fileName = `TodoONada_Products_Report.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.status(HTTPCodes.StatusCodes.OK).send(downloadProductsBuffer);
  } catch (err) {
    res.status(HTTPCodes.StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't download products: ${err.message}`,
    });
  }
};

module.exports = {
  method: 'GET',
  route: '/reports/products',
  action,
};
