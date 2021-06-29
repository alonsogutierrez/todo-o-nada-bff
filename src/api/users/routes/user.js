const express = require('express');

const POSTCreateUserRoute = require('./../infrastructure/POSTCreateUser.route');
const User = require('../../../db/models/user');
const auth = require('./../../../middlewares/auth');

const router = new express.Router();
const logger = console;

router[POSTCreateUserRoute.method.toLocaleLowerCase()](
  POSTCreateUserRoute.route,
  POSTCreateUserRoute.action
);

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    logger.log('User succesfully login');
    res.send({ user, token });
  } catch (e) {
    logger.error('Cant login user');
    res.status(401).send(e.message);
  }
});

router.get('/users/profile', auth, async (req, res) => {
  try {
    const email = req.query.userId;
    const user = await User.find({
      email,
    });
    logger.log('User profile OK');
    res.status(200).send({ user });
  } catch (e) {
    logger.error('Cant find profile user');
    res.status(401).send(e.message);
  }
});

module.exports = router;
