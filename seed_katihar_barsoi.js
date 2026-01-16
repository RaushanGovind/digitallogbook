import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

// New route data from Katihar to Barsoi
const katiharBarsoi = [
    { "station": "Katihar Jn", "code": "KIR", "km": 0.00 },
    { "station": "Dandkhora", "code": "DNKR", "km": 4.97 },
    { "station": "Gorphar Halt", "code": "GPA", "km": 9.11 },
    { "station": "Sonaili III SR", "code": "SNL", "km": 12.17 },
    { "station": "Bishanpur Halt", "code": "BSNP", "km": 16.76 },
    { "station": "Jhaua SR", "code": "JUA", "km": 19.75 },
    { "station": "Meenapur Halt", "code": "MNP", "km": 23.04 },
    { "station": "Salmari SR", "code": "SMR", "km": 25.65 },
    { "station": "Mukuria Jn", "code": "MFA", "km": 29.22 },
    { "station": "Barsoi Jn", "code": "BOE", "km": 34.61 }
];

const sortedStations = katiharBarsoi.sort((a, b) => a.km - b.km);

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

async function seedKatiharBarsoiRoute() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected.');

        const operations = sortedStations.map((curr, index) => {
            const prev = index > 0 ? sortedStations[index - 1] : null;
            const next = index < sortedStations.length - 1 ? sortedStations[index + 1] : null;

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

        console.log(`🚀 Adding ${operations.length} stations from Katihar-Barsoi route...`);
        const result = await Station.bulkWrite(operations);
        console.log('🎉 Katihar-Barsoi route successfully added!');
        console.log(`   - Matched: ${result.matchedCount}`);
        console.log(`   - Modified: ${result.modifiedCount}`);
        console.log(`   - Upserted: ${result.upsertedCount}`);

        console.log('\n📊 Route Summary:');
        console.log(`   From: ${sortedStations[0].station} (${sortedStations[0].code})`);
        console.log(`   To: ${sortedStations[sortedStations.length - 1].station} (${sortedStations[sortedStations.length - 1].code})`);
        console.log(`   Total Distance: ${sortedStations[sortedStations.length - 1].km} km`);
        console.log(`   Total Stations: ${sortedStations.length}`);

        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

seedKatiharBarsoiRoute();
