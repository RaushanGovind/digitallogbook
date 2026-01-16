import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

dotenv.config({ path: './server/.env' });

const MONGO_URI = process.env.MONGO_URI;

// Define Schema
const StationSchema = new mongoose.Schema({}, { strict: false });
const Station = mongoose.model('Station', StationSchema);

async function checkDatabase() {
    try {
        console.log('--- DIAGNOSTIC START ---');
        console.log(`📡 Checking URI from env: ${MONGO_URI ? 'FOUND' : 'MISSING'}`);
        // Log the host part of the URI to confirm it's Atlas
        if (MONGO_URI) {
            const host = MONGO_URI.split('@')[1]?.split('/')[0];
            console.log(`🌍 Target Host: ${host || 'Unknown'}`);
            console.log(`🗄️  Target DB: ${MONGO_URI.split('/').pop().split('?')[0]}`);
        } else {
            console.log('⚠️  Falling back to localhost');
        }

        const uriToUse = MONGO_URI || 'mongodb://127.0.0.1:27017/running_log_book';
        await mongoose.connect(uriToUse);
        console.log('✅ Connected.');

        // 1. Count Stations
        const count = await Station.countDocuments();
        console.log(`📊 Total Stations in DB: ${count}`);

        // 2. Check for Specific Station (KIR)
        const kir = await Station.findOne({ code: 'KIR' });
        console.log('🔍 Check "KIR" Station:');
        if (kir) {
            console.log(JSON.stringify(kir.toObject(), null, 2));
        } else {
            console.log('❌ Station "KIR" NOT FOUND');
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

checkDatabase();
