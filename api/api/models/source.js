const mongoose = require('mongoose');
// layout of source
const sourceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    tld: String,
    rating: Number
});

module.exports = mongoose.model('Source', sourceSchema);