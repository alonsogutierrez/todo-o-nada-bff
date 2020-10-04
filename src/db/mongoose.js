const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
  user: process.env.MONGO_DB_USER,
  pass: process.env.MONGO_DB_PASSWORD,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
