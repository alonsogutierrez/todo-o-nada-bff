const User = require('./../../../db/models/user');

const logger = console;

const create = async (user) => {
  const newUser = new User(user);
  try {
    await newUser.save();
    logger.log('User saved succesfully');
    const token = await newUser.generateAuthToken();
    return { user: newUser, token };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { create };
