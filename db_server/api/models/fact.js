const mongoose = require('mongoose');
// layout of source
const factSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    statement: { type: String, required: true},
    popularity: { type: Number, required: false }
});

module.exports = mongoose.model('Fact', factSchema);