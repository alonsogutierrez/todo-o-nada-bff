const express = require('express');
const User = require('../../../db/models/user');
const router = new express.Router();

const logger = console;

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  logger.log('User: ', user);
  try {
    logger.log('Going to save user');
    await user.save();
    logger.log('User saved succesfully');
    logger.log('Generating token authentication');
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    logger.error('Can`t save user: ', e.message);
    res.status(400).send(e.message);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    console.log('req.body: ', req.body);
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log('user: ', user);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
