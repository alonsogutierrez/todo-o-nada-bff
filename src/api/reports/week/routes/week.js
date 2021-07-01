const express = require('express');

const auth = require('./../../../../middlewares/auth');
const getWeekSales = require('../useCases/getWeekSales');

const router = new express.Router();
const logger = console;

router.get('/reports/week', auth, async (req, res) => {
  try {
    logger.log('Going to calculate week sales');
    const weekSales = await getWeekSales();
    res.status(200).send(weekSales);
  } catch (e) {
    logger.error('Can`t get week sales: ', e.message);
    res.status(500).send(e.message);
  }
});

module.exports = router;
