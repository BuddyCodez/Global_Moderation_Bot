const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  init: () => {
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
    };
    mongoose.connect(
      "mongodb+srv://Arctricity:PgC820hxRAgAXiHV@arctricitybot.yb3xzox.mongodb.net/test",
      dbOptions
    );
    mongoose.Promise = global.Promise;

    mongoose.connection.on("connected", () => {
      console.log("<<<<< Mongoose has successfully connected >>>>>");
    });

    mongoose.connection.on("err", (err) => {
      console.error(`<<<<< Mongoose connection error: \n${err.stack} >>>>>`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose connection lost");
    });
  },
};
