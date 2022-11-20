const mongoose = require("mongoose");

const MusicSchema = mongoose.Schema({
    UserId: String,
    FavoriteList: Array,
});

module.exports = mongoose.model("Music", MusicSchema);
