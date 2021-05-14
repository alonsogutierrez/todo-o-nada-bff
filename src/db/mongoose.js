const mongoose = require('mongoose');

const logger = console;

const connectWithMongodDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      user: process.env.MONGO_DB_USER,
      pass: process.env.MONGO_DB_PASSWORD,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    logger.info('Well connected with MongoDB');
    return true;
  } catch (err) {
    throw new Error(`Error connecting with MongoDB: ${err.message}`);
  }
};

module.exports = { connectWithMongodDB };
