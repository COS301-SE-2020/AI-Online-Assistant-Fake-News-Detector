const mongoose = require("mongoose");

const nnModelSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  date: { type: Date, required: true },
  model: { type: String, required: true },
});

module.exports = mongoose.model("nnModel", nnModelSchema);
