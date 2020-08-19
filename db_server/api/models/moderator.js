const mongoose = require("mongoose");
// layout of source
const Userschema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  emailAddress: { type: String, required: true }, // Used as login username
  password: { type: String, required: true },
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  authenticationLevel: { type: Number, required: true, default: 1 }, //1 = Normal User, 2 = Normal moderator, 3 = super user -> can delete Users
});

module.exports = mongoose.model("moderator", Userschema);
