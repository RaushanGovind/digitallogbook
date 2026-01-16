import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

dotenv.config({ path: './server/.env' });

// Raw Data (Sorted by KM Descending in original, let's sort Ascending for linking)
const rawStations = [
    { "station": "BARSOI Jn", "code": "BOE", "km": 144.57 },
    { "station": "Sanjaygram Halt", "code": "SJGM", "km": 136.70 },
    { "station": "Sudhani", "code": "SUD", "km": 132.66 },
    { "station": "Ajharail Halt", "code": "AHL", "km": 127.93 },
    { "station": "Telta", "code": "TETA", "km": 123.74 },
    { "station": "Dalkolha", "code": "DLK", "km": 115.52 },
    { "station": "Surjakamal", "code": "SJKL", "km": 108.60 },
    { "station": "Kanki", "code": "KKA", "km": 100.99 },
    { "station": "Hatwar", "code": "HWR", "km": 95.51 },
    { "station": "Kishanganj", "code": "KNE", "km": 87.31 },
    { "station": "Panjipara", "code": "PJP", "km": 78.87 },
    { "station": "Gaisal", "code": "GIL", "km": 70.18 },
    { "station": "Gunjaria", "code": "GEOR", "km": 64.55 },
    { "station": "Aluabari Road", "code": "AUB", "km": 56.58 },
    { "station": "Mangurjan", "code": "MXJ", "km": 45.37 },
    { "station": "Tinmile Hat", "code": "TMH", "km": 39.25 },
    { "station": "Dumdangi", "code": "DMZ", "km": 30.56 },
    { "station": "Chatterhat", "code": "CAT", "km": 21.39 },
    { "station": "Rangapani", "code": "RNI", "km": 7.26 },
    { "station": "NEW JALPAIGURI JN", "code": "NJP", "km": 0.00 }
];

// Sort matches: NJP (0) -> ... -> BOE (144)
// Ascending KM
const sortedStations = rawStations.sort((a, b) => a.km - b.km);

// Schema Definition (Quick Inline for Script)
const StationSchema = new mongoose.Schema({
    code: String,
    name: String,
    kmFromOrigin: Number,
    nextStation: Object,
    prevStation: Object,
    zone: String,
    division: String
}, { strict: false });

const Station = mongoose.model('Station', StationSchema);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/running_log_book';

async function seedLinkedRoute() {
    try {
        console.log('🔌 Connecting...');
        await mongoose.connect(MONGO_URI);

        const operations = sortedStations.map((curr, index) => {
            const prev = index > 0 ? sortedStations[index - 1] : null;
            const next = index < sortedStations.length - 1 ? sortedStations[index + 1] : null;

            // Calculate inter-station distances
            const distToNext = next ? parseFloat((next.km - curr.km).toFixed(2)) : 0;
            const distToPrev = prev ? parseFloat((curr.km - prev.km).toFixed(2)) : 0;

            const updateObj = {
                name: curr.station,
                kmFromOrigin: curr.km,
                code: curr.code,
                division: 'KIR',
                zone: 'NFR',

                nextStation: next ? {
                    code: next.code,
                    name: next.station,
                    distanceKm: distToNext
                } : null,

                prevStation: prev ? {
                    code: prev.code,
                    name: prev.station,
                    distanceKm: distToPrev
                } : null
            };

            return {
                updateOne: {
                    filter: { code: curr.code },
                    update: { $set: updateObj },
                    upsert: true
                }
            };
        });

        console.log(`🚀 Linking ${operations.length} stations...`);
        await Station.bulkWrite(operations);
        console.log('🎉 Database updated with Linked List logic!');

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

seedLinkedRoute();
