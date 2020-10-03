const express = require('express');
const router = new express.Router();

const logger = console;

router.get('/health', async (req, res) => {
  logger.log('Api health request');
  res.status(200).send('Api is running');
});

module.exports = router;
