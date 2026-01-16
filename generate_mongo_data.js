import fs from 'fs';
import { stationsData } from './src/data/stations.js';
import { sectionsData } from './src/data/sections.js';

// Create a directory for the output if it doesn't exist
if (!fs.existsSync('mongo_exports')) {
    fs.mkdirSync('mongo_exports');
}

// Write Stations Data
fs.writeFileSync(
    'mongo_exports/stations.json',
    JSON.stringify(stationsData, null, 2)
);
console.log('✅ Generated mongo_exports/stations.json');

// Write Sections Data
fs.writeFileSync(
    'mongo_exports/sections.json',
    JSON.stringify(sectionsData, null, 2)
);
console.log('✅ Generated mongo_exports/sections.json');
