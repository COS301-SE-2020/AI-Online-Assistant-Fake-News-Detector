const mongoose = require('mongoose');
// layout of source
const sourceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    tld: { type: String, required: true},
    rating: { type: Number, required: true }
});

module.exports = mongoose.model('Source', sourceSchema);