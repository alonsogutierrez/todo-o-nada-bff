const express = require('express');
const User = require('../../../db/models/user');
const router = new express.Router();

const logger = console;

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    logger.log('User saved succesfully');
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    logger.error('Can`t save user: ', e.message);
    res.status(500).send(e.message);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    logger.log('User succesfully login');
    res.send({ user });
  } catch (e) {
    logger.error('Cant login user');
    res.status(401).send(e.message);
  }
});

router.get('/users/profile', async (req, res) => {
  try {
    const email = req.query.userId;
    const user = await User.find({
      email
    });
    logger.log('User profile OK');
    res.status(200).send({ user });
  } catch (e) {
    logger.error('Cant find profile user');
    res.status(401).send(e.message);
  }
});

module.exports = router;
