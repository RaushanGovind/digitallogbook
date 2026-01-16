import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

// New route data from Katihar
const katiharRoute = [
    { "station": "Katihar Jn.", "code": "KIR", "km": 0.00 },
    { "station": "Katihar 'B'", "code": "KIRB", "km": 1.06 },
    { "station": "Maniyan", "code": "MIYN", "km": 6.00 },
    { "station": "Kuretha SR", "code": "KUQ", "km": 11.23 },
    { "station": "Sahja Halt", "code": "SAJH", "km": 15.22 },
    { "station": "Pranpur Road", "code": "PQD", "km": 18.41 },
    { "station": "Labha SR", "code": "LAV", "km": 23.11 },
    { "station": "Dilli Dewanganj", "code": "DVJ", "km": 26.68 },
    { "station": "Kumedpur Jn.", "code": "KDPR", "km": 29.53 }
];

// Sort by KM (already sorted, but just to be safe)
const sortedStations = katiharRoute.sort((a, b) => a.km - b.km);

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

async function seedKatiharRoute() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected.');

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
                division: 'KIR', // Katihar Division
                zone: 'NFR',     // Northeast Frontier Railway

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

        console.log(`🚀 Adding ${operations.length} stations from Katihar route...`);
        const result = await Station.bulkWrite(operations);
        console.log('🎉 Katihar route successfully added!');
        console.log(`   - Matched: ${result.matchedCount}`);
        console.log(`   - Modified: ${result.modifiedCount}`);
        console.log(`   - Upserted: ${result.upsertedCount}`);

        // Display summary
        console.log('\n📊 Route Summary:');
        console.log(`   From: ${sortedStations[0].station} (${sortedStations[0].code})`);
        console.log(`   To: ${sortedStations[sortedStations.length - 1].station} (${sortedStations[sortedStations.length - 1].code})`);
        console.log(`   Total Distance: ${sortedStations[sortedStations.length - 1].km} km`);

        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

seedKatiharRoute();
