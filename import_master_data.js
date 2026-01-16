import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: './server/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/running_log_book';

const StationSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: String,
    zone: String,
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
}, { strict: false });

const Station = mongoose.model('Station', StationSchema);

async function importData() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected.');

        // 1. Load Stations
        console.log('📖 Reading mongo_exports/stations.json...');
        const stationsFile = fs.readFileSync('mongo_exports/stations.json', 'utf8');
        const stations = JSON.parse(stationsFile);

        const stationOps = stations.map(s => ({
            updateOne: {
                filter: { code: s.code },
                update: { $set: s },
                upsert: true
            }
        }));

        console.log(`🚀 Upserting ${stationOps.length} stations...`);
        const stationResult = await Station.bulkWrite(stationOps);
        console.log('🎉 Stations updated!', stationResult);

        // 2. Load Sections (if needed)
        // Note: The app currently uses a linked-list graph for routing,
        // but importing section metadata is good for the "Routes" list.
        console.log('📖 Reading mongo_exports/sections.json...');
        const sectionsFile = fs.readFileSync('mongo_exports/sections.json', 'utf8');
        const sections = JSON.parse(sectionsFile);

        const SectionSchema = new mongoose.Schema({}, { strict: false });
        const Section = mongoose.model('Section', SectionSchema);

        const sectionOps = sections.map(sec => ({
            updateOne: {
                filter: { id: sec.id },
                update: { $set: sec },
                upsert: true
            }
        }));

        console.log(`🚀 Upserting ${sectionOps.length} sections...`);
        const sectionResult = await Section.bulkWrite(sectionOps);
        console.log('🎉 Sections updated!', sectionResult);

        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error during import:', err);
    }
}

importData();
