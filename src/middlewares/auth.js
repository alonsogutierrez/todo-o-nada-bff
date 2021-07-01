const jwt = require('jsonwebtoken');
const User = require('./../db/models/user');

const JWT_SECRET = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      _id: decodedToken._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error('Invalid request');
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
