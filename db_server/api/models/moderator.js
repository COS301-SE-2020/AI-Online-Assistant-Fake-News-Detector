const mongoose = require("mongoose");
// layout of source
const moderatorSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  emailAddress: { type: String, required: true }, // Used as login username
  password: { type: String, required: true },
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  authenticationLevel: { type: Number, required: true, default: 1 }, // 1 = Normal moderator, 2 = super user -> can delete moderators
});

module.exports = mongoose.model("moderator", moderatorSchema);
