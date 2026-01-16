const mongoose = require('mongoose');

const userSectionSchema = new mongoose.Schema({
    cmsId: { type: String, required: true }, // Link to the user
    fromStation: { type: String, required: true },
    toStation: { type: String, required: true },
    distance: { type: Number, required: true },
    sectionName: { type: String }, // Optional custom name
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserSection', userSectionSchema);
