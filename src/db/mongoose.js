const mongoose = require('mongoose');

console.log('MONGODB_URL: ', process.env.MONGODB_URL);
console.log('MONGO_DB_USER: ', process.env.MONGO_DB_USER);
console.log('MONGO_DB_PASSWORD: ', process.env.MONGO_DB_PASSWORD);

mongoose.connect(process.env.MONGODB_URL, {
  user: process.env.MONGO_DB_USER,
  pass: process.env.MONGO_DB_PASSWORD,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
