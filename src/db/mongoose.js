const mongoose = require('mongoose');

console.log('MONGODB_URL: ', process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
