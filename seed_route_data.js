import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Since Station.js is CJS, we can import it using default import or createRequire
// But mixing is messy. Let's just define the schema inline to be safe and quick, 
// matching the existing schema structure.

dotenv.config({ path: './server/.env' });

const routeData = [
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

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/running_log_book';

// Re-defining Schema to avoid CJS/ESM module conflict in this simple script
const StationSchema = new mongoose.Schema({
    code: String,
    division: String,
    section: String,
    csl: String,
    platformCapacity: String,
    signalling: String,
    blockInstrument: String,
    interlocking: String,
    mps: String,
    specialNote: String,
    km: Number,
    msl: Number,
    name: String // Add Name field
}, { strict: false }); // Allow flexible fields

const Station = mongoose.model('Station', StationSchema);

async function mapRouteData() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected.');

        const operations = routeData.map(data => ({
            updateOne: {
                filter: { code: data.code },
                update: {
                    $set: {
                        name: data.station,
                        km: data.km,
                        division: 'KIR', // Default
                        zone: 'NFR'     // Default
                    }
                },
                upsert: true
            }
        }));

        console.log(`🚀 Updating/Inserting ${operations.length} stations...`);
        const result = await Station.bulkWrite(operations);
        console.log('🎉 Operation Complete!', result);

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

mapRouteData();
