import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: './server/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/running_log_book';

const StationSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: String,
    destinations: Array,
    nextStation: Object,
    prevStation: Object,
    section: String
}, { strict: false });

const Station = mongoose.model('Station', StationSchema);

async function synchronizeAllData() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected.');

        // 1. Convert legacy nextStation/prevStation to destinations for ALL stations
        console.log('🔄 Converting legacy pointers to destinations...');
        const allStationsInDb = await Station.find({});

        for (const station of allStationsInDb) {
            let updatedDestinations = station.destinations || [];

            // From nextStation
            if (station.nextStation && station.nextStation.code) {
                const alreadyExists = updatedDestinations.some(d => d.code === station.nextStation.code);
                if (!alreadyExists) {
                    updatedDestinations.push({
                        code: station.nextStation.code,
                        name: station.nextStation.name,
                        distance: station.nextStation.distanceKm,
                        direction: 'forward',
                        routeName: station.section || 'Main Line'
                    });
                }
            }

            // From prevStation
            if (station.prevStation && station.prevStation.code) {
                const alreadyExists = updatedDestinations.some(d => d.code === station.prevStation.code);
                if (!alreadyExists) {
                    updatedDestinations.push({
                        code: station.prevStation.code,
                        name: station.prevStation.name,
                        distance: station.prevStation.distanceKm,
                        direction: 'backward',
                        routeName: station.section || 'Main Line'
                    });
                }
            }

            if (updatedDestinations.length > (station.destinations || []).length) {
                await Station.updateOne({ _id: station._id }, { $set: { destinations: updatedDestinations } });
            }
        }
        console.log('✅ Legacy migration complete.');

        // 2. Link stations from the JSON sections (The 70 new stations)
        console.log('📖 Processing mongo_exports/stations.json for section linking...');
        const stationsFile = fs.readFileSync('mongo_exports/stations.json', 'utf8');
        const jsonStations = JSON.parse(stationsFile);

        const sections = {};
        jsonStations.forEach((s, index) => {
            if (s.section) {
                if (!sections[s.section]) sections[s.section] = [];
                sections[s.section].push({ ...s, fileIndex: index });
            }
        });

        for (const sectionName in sections) {
            const list = sections[sectionName];
            console.log(`🔗 Linking section: ${sectionName} (${list.length} stations)`);

            for (let i = 0; i < list.length; i++) {
                const curr = list[i];
                const prev = i > 0 ? list[i - 1] : null;
                const next = i < list.length - 1 ? list[i + 1] : null;

                const dbStation = await Station.findOne({ code: curr.code });
                if (!dbStation) continue;

                let updatedDestinations = dbStation.destinations || [];
                let changes = false;

                if (next) {
                    const alreadyExists = updatedDestinations.some(d => d.code === next.code);
                    if (!alreadyExists) {
                        updatedDestinations.push({
                            code: next.code,
                            name: next.code, // We don't have name in JSON, using code
                            distance: 10, // Placeholder as KM is null in JSON
                            direction: 'forward',
                            routeName: sectionName
                        });
                        changes = true;
                    }
                }

                if (prev) {
                    const alreadyExists = updatedDestinations.some(d => d.code === prev.code);
                    if (!alreadyExists) {
                        updatedDestinations.push({
                            code: prev.code,
                            name: prev.code, // We don't have name in JSON, using code
                            distance: 10, // Placeholder
                            direction: 'backward',
                            routeName: sectionName
                        });
                        changes = true;
                    }
                }

                if (changes) {
                    await Station.updateOne({ code: curr.code }, { $set: { destinations: updatedDestinations } });
                }
            }
        }

        console.log('🎉 All systems updated!');
        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error during synchronization:', err);
    }
}

synchronizeAllData();
