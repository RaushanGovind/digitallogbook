import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/running_log_book';

const StationSchema = new mongoose.Schema({
    code: String,
    name: String,
    kmFromOrigin: Number,
    destinations: Array,
    nextStation: Object,
    prevStation: Object,
    zone: String,
    division: String
}, { strict: false });

const Station = mongoose.model('Station', StationSchema);

async function migrateToDestinations() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected.');

        const stations = await Station.find({});
        console.log(`📊 Found ${stations.length} stations to migrate...`);

        let updated = 0;
        for (const station of stations) {
            const destinations = [];

            // Add next station as a destination (forward direction)
            if (station.nextStation && station.nextStation.code) {
                destinations.push({
                    code: station.nextStation.code,
                    name: station.nextStation.name,
                    distance: station.nextStation.distanceKm,
                    direction: 'forward'
                });
            }

            // Add previous station as a destination (backward direction)
            if (station.prevStation && station.prevStation.code) {
                destinations.push({
                    code: station.prevStation.code,
                    name: station.prevStation.name,
                    distance: station.prevStation.distanceKm,
                    direction: 'backward'
                });
            }

            if (destinations.length > 0) {
                await Station.updateOne(
                    { code: station.code },
                    { $set: { destinations: destinations } }
                );
                updated++;
            }
        }

        console.log(`✅ Migration complete! Updated ${updated} stations.`);
        console.log('\n📋 Sample station structure:');
        const sample = await Station.findOne({ code: 'KIR' });
        console.log(JSON.stringify(sample, null, 2));

        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

migrateToDestinations();
