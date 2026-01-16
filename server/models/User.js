const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    cmsId: { type: String, required: true, unique: true },
    dlbId: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Plain text for now as per request
    frequentStations: { type: [String], default: [] },
    preferences: {
        theme: { type: String, default: 'light' },
        font: { type: String, default: 'Inter' },
        primaryColor: { type: String, default: '#0d9488' },
        timeFormat: { type: String, default: '24h' },
        dateFormat: { type: String, default: 'DD/MM/YYYY' }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = { User: mongoose.model('User', userSchema) };
