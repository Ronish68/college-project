const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URI).then(() => {
    console.log(`Mongodb connected with server: ${mongoose.connection.host}`);
  }).catch((err) => {
    console.error('Mongoose connection error:', err);
  });
};

module.exports = connectDatabase;