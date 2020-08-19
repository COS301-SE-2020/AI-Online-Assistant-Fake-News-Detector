const mongoose = require("mongoose");
// layout of source
const reportSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: { type: Number, required: true }, // 1 = Fact, 2 = Source
  description: { type: String, required: true },
  reportCount: { type: Number, required: true, default: 1 },
  dCaptured: { type: Date, required: true, default: Date.now() },
  bActive: { type: Boolean, required: true, default: 1 }, // 1 = active, 0 = inactive
  reportedBy: { type: Array, required: false },
});

module.exports = mongoose.model("report", reportSchema);
