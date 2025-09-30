const mongoose = require("mongoose");

const VideoTopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  key: {
    type: String,
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = Video = mongoose.model("VideoTopic", VideoTopicSchema);
