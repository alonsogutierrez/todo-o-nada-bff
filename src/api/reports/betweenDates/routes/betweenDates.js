const getSalesBetweenDates = require('../useCases/getSalesBetweenDates');

const express = require('express');
const router = new express.Router();

const logger = console;

router.get('/reports/betweenDates', async (req, res) => {
  try {
    if (!req.query.startDate || !req.query.endDate) {
      throw new Error('Invalid dates');
    }
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    logger.log(`Going to get sales between ${startDate} and ${endDate}`);
    const ordersBuffer = await getSalesBetweenDates(startDate, endDate);
    const fileName = `TodoONada_Report_${startDate}_${endDate}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.status(200).send(ordersBuffer);
  } catch (e) {
    logger.error('Can`t get sales in betweenDates: ', e.message);
    res.status(500).send(e.message);
  }
});

module.exports = router;
