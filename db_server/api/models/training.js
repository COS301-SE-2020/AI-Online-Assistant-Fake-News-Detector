const mongoose = require('mongoose');
// layout of source
const trainingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    article: { type: String, required: true},
    fake: { type: Boolean, required: true},
});

module.exports = mongoose.model('Training', trainingSchema);