const mongoose = require("mongoose");

const NNStatsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  iTrainingTime: { type: Number, required: true },
  iTrainingCount: { type: Number, required: true },
  dCaptured: { type: Date, required: true, default: Date.now() }
});

module.exports = mongoose.model("nnStats", NNStatsSchema);
