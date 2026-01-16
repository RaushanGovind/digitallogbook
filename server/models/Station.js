const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: String,

    // Geographical / Administrative
    zone: String,
    division: String,

    // Distance Data
    kmFromOrigin: Number, // Absolute KM marker for reference

    // EVERY STATION IS AN ORIGIN
    // Its connected stations are DESTINATIONS with distances
    destinations: [{
        code: String,
        name: String,
        distance: Number,  // Distance from THIS origin to that destination
        direction: String, // 'forward' or 'backward' for route building
        routeName: String
    }],

    // Legacy fields (keeping for backward compatibility)
    nextStation: {
        code: String,
        name: String,
        distanceKm: Number
    },
    prevStation: {
        code: String,
        name: String,
        distanceKm: Number
    },

    // Other legacy fields
    section: String,
    csl: String,
    platformCapacity: String,
    signalling: String,
    blockInstrument: String,
    interlocking: String,
    mps: String,
    specialNote: String,
});

module.exports = mongoose.model('Station', StationSchema);
