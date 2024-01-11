const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    new: true,
  }
);

module.exports = mongoose.model("brand", brandSchema);
