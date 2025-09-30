const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    default: "",
    required: true,
  },

  primaryKey: {
    type: Number,
    required: true,
  },

  // 1 for success kit, 2 for mini success kit , 3 for training
  products: [{ type: String }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = Video = mongoose.model("Video", VideoSchema);
