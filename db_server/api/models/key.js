const mongoose = require('mongoose');
// layout of source
const keySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: { type: String, required: true},
    key: { type: String, required: true},
});

module.exports = mongoose.model('Key', keySchema);