const mongoose = require("mongoose");

const WelcomeSchema = mongoose.Schema({
  Guild: { type: String, required: true },
  Image: String,
  Welcome_txt: String,
  Channel: String,
  Message: String,
  Toggle: Boolean,
  Circle: String,
  User_name: String,
  Title: String,
  Description: String,
  Color: String,
  Footer: Object,
  Fields: Array,
  msg: String,
});

module.exports = mongoose.model("Welcome", WelcomeSchema);
