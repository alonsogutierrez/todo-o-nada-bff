const express = require('express');

const auth = require('./../../../../middlewares/auth');
const getSalesBetweenDates = require('../useCases/getSalesBetweenDates');

const router = new express.Router();
const logger = console;

router.get('/reports/betweenDates', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      throw new Error('Invalid dates');
    }
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
