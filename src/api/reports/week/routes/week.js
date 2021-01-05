const express = require('express');
const router = new express.Router();

const logger = console;

router.get('/reports/week', async (req, res) => {
  try {
    //TODO: Calculate week sales by day
    logger.log('Going to calculate week sales');
    res.status(200).send([
        { x: new Date(2019, 5, 16), y: 34875 },
        { x: new Date(2019, 5, 17), y: 35984 },
        { x: new Date(2019, 5, 18), y: 78547 },
        { x: new Date(2019, 5, 19), y: 42400 },
        { x: new Date(2019, 5, 20), y: 35687 },
        { x: new Date(2019, 5, 21), y: 46584 },
    ]);
  } catch (e) {
    logger.error('Can`t get week sales: ', e.message);
    res.status(500).send(e.message);
  }
});

module.exports = router;
