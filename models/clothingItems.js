const mongoose = require("mongoose");
const validator = require("validator");

const allowedWeather = ["hot", "warm", "cold"];
const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: {
      values: allowedWeather,
      message: "Weather must be one of the following: hot, warm, cold",
    },
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("clothingItem", clothingItem);
