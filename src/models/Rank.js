const mongoose = require("mongoose");

const RankSchema = new mongoose.Schema({
  userreference: {
    type: String,
    required: true,
  },

  activeIncome: {
    type: Number,
    required: true,
  },

  passiveIncome: {
    type: Number,
    required: true,
  },

  rank: {
    type: Number,
    required: true,
    default: 0,
  },


  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

});

module.exports = Video = mongoose.model("Rank", RankSchema);
