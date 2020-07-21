const mongoose = require("mongoose");
// layout of source
const reportSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: { type: Number, required: true }, // 1 = Fact, 2 = Source
  description: { type: String, required: true },
  dCaptured: { type: Date, required: true, default: Date.now() },
  bActive: { type: Boolean, required: true, default: 1 }, // 1 = active, 0 = inactive
});

module.exports = mongoose.model("report", reportSchema);
