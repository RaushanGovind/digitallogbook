const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const Station = require('./models/Station');
const { User } = require('./models/User');
const UserSection = require('./models/UserSection');

const app = express();
app.use(express.json());
app.use(cors());

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/running_log_book';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected to', MONGO_URI))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Routes ---

// 0. Register User
app.post('/api/register', async (req, res) => {
    try {
        const { name, designation, cmsId, password } = req.body;

        if (!name || !designation || !cmsId || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ cmsId });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this CMS ID already exists' });
        }

        // Generate DLB ID
        const lastUser = await User.findOne().sort({ dlbId: -1 });
        let nextDlbId = 'DLB0001';
        if (lastUser && lastUser.dlbId) {
            const lastNum = parseInt(lastUser.dlbId.replace('DLB', ''));
            nextDlbId = `DLB${String(lastNum + 1).padStart(4, '0')}`;
        }

        const newUser = new User({
            name,
            designation,
            cmsId,
            password,
            dlbId: nextDlbId
        });
        await newUser.save();

        console.log(`User registered: ${cmsId} as ${nextDlbId}`);
        res.status(201).json({ message: 'Registration successful', user: { name, cmsId, dlbId: nextDlbId } });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 0.5 Login User
app.post('/api/login', async (req, res) => {
    try {
        const { cmsId, password } = req.body;
        const user = await User.findOne({ cmsId });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            user: {
                name: user.name,
                cmsId: user.cmsId,
                dlbId: user.dlbId,
                designation: user.designation,
                frequentStations: user.frequentStations || [],
                preferences: user.preferences
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// 0.6 Update User Preferences
app.put('/api/users/:cmsId/preferences', async (req, res) => {
    try {
        const { frequentStations, preferences } = req.body;
        const updateData = {};
        if (frequentStations !== undefined) updateData.frequentStations = frequentStations;
        if (preferences !== undefined) updateData.preferences = preferences;

        const user = await User.findOneAndUpdate(
            { cmsId: req.params.cmsId },
            { $set: updateData },
            { new: true }
        );
        res.json({
            message: 'Preferences updated',
            frequentStations: user.frequentStations,
            preferences: user.preferences
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 1. Get All Stations
app.get('/api/stations', async (req, res) => {
    try {
        const [mainStations, manualSections] = await Promise.all([
            Station.find({}),
            UserSection.find({})
        ]);

        const stationMap = new Map();

        mainStations.forEach(s => {
            stationMap.set(s.code, {
                _id: s._id,
                code: s.code,
                name: s.name,
                section: s.section
            });
        });

        manualSections.forEach(sec => {
            if (!stationMap.has(sec.fromStation)) {
                stationMap.set(sec.fromStation, {
                    code: sec.fromStation,
                    name: sec.fromStation,
                    section: 'Manual Entry'
                });
            }
            if (!stationMap.has(sec.toStation)) {
                stationMap.set(sec.toStation, {
                    code: sec.toStation,
                    name: sec.toStation,
                    section: 'Manual Entry'
                });
            }
        });

        const sorted = Array.from(stationMap.values()).sort((a, b) => a.code.localeCompare(b.code));
        res.json(sorted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get Station by Code
app.get('/api/stations/:code', async (req, res) => {
    try {
        const station = await Station.findOne({ code: req.params.code });
        if (!station) return res.status(404).json({ error: 'Station not found' });
        res.json(station);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Get Junctions (Stations with > 2 destinations)
app.get('/api/junctions', async (req, res) => {
    try {
        const junctions = await Station.find({ "destinations.2": { $exists: true } });
        res.json(junctions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Get User Sections
app.get('/api/user-sections/:cmsId', async (req, res) => {
    try {
        const sections = await UserSection.find({ cmsId: req.params.cmsId });
        res.json(sections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Add User Section
app.post('/api/user-sections', async (req, res) => {
    try {
        const { cmsId, fromStation, toStation, distance } = req.body;
        const newSection = new UserSection({ cmsId, fromStation, toStation, distance });
        await newSection.save();
        res.status(201).json(newSection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Update User Section
app.put('/api/user-sections/:id', async (req, res) => {
    try {
        const { fromStation, toStation, distance } = req.body;
        const updated = await UserSection.findByIdAndUpdate(
            req.params.id,
            { fromStation, toStation, distance },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 7. Delete User Section
app.delete('/api/user-sections/:id', async (req, res) => {
    try {
        await UserSection.findByIdAndDelete(req.params.id);
        res.json({ message: 'Section deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 8. Multi-Route Calculation (Finds multiple paths if they exist)
app.get('/api/route', async (req, res) => {
    try {
        const { from, to } = req.query;
        if (!from || !to) return res.status(400).json({ message: 'From and To station codes required' });

        // 1. Fetch all data
        const [mainStations, manualSections] = await Promise.all([
            Station.find({}),
            UserSection.find({})
        ]);

        const stationMap = new Map();

        // Populate map with main stations
        mainStations.forEach(s => {
            const obj = s.toObject();
            stationMap.set(obj.code, obj);
        });

        // Populate/Update map with manual sections
        manualSections.forEach(sec => {
            if (!stationMap.has(sec.fromStation)) {
                stationMap.set(sec.fromStation, { code: sec.fromStation, name: sec.fromStation, destinations: [] });
            }
            if (!stationMap.has(sec.toStation)) {
                stationMap.set(sec.toStation, { code: sec.toStation, name: sec.toStation, destinations: [] });
            }

            const fromNode = stationMap.get(sec.fromStation);
            const toNode = stationMap.get(sec.toStation);

            // Add bidirectional link for manual sections
            fromNode.destinations.push({
                code: sec.toStation,
                name: toNode.name,
                distance: sec.distance,
                direction: 'forward',
                routeName: sec.sectionName || 'Manual Section'
            });
            toNode.destinations.push({
                code: sec.fromStation,
                name: fromNode.name,
                distance: sec.distance,
                direction: 'backward',
                routeName: sec.sectionName || 'Manual Section'
            });
        });

        const startStation = stationMap.get(from);
        const endStation = stationMap.get(to);

        if (!startStation || !endStation) {
            return res.status(404).json({
                message: 'Stations not found. Ensure codes are correct and stations exist in Main or Manual data.'
            });
        }

        if (from === to) {
            return res.json({
                from: startStation.name,
                to: endStation.name,
                totalDistance: 0,
                route: [],
                hops: 0,
                routesUsed: 0
            });
        }

        // Dijkstra's Algorithm for Shortest Path
        function findShortestPaths(source, target) {
            const results = [];
            const pq = [{ code: source, dist: 0, path: [] }];
            const minDists = new Map();
            minDists.set(source, 0);

            while (pq.length > 0) {
                pq.sort((a, b) => a.dist - b.dist);
                const { code, dist, path } = pq.shift();

                if (dist > (minDists.get(code) || Infinity)) continue;

                if (code === target) {
                    results.push({
                        totalDistance: parseFloat(dist.toFixed(2)),
                        route: path,
                        hops: path.length,
                        routesUsed: detectRoutesUsed(path)
                    });
                    if (results.length >= 3) break;
                    continue;
                }

                const current = stationMap.get(code);
                if (!current || !current.destinations) continue;

                for (const next of current.destinations) {
                    const newDist = dist + next.distance;
                    if (results.length > 0 && newDist > results[0].totalDistance + 200) continue;

                    if (!minDists.has(next.code) || newDist < minDists.get(next.code) + 10) {
                        minDists.set(next.code, newDist);
                        pq.push({
                            code: next.code,
                            dist: newDist,
                            path: [...path, {
                                origin: code,
                                originName: current.name,
                                destination: next.code,
                                destinationName: next.name,
                                distance: next.distance,
                                routeName: next.routeName
                            }]
                        });
                    }
                }
                if (pq.length > 1000) pq.splice(500);
            }
            return results;
        }

        const foundPaths = findShortestPaths(from, to);

        if (foundPaths.length === 0) {
            return res.status(404).json({
                message: 'ROUTE NOT FOUND: These stations are not connected in the combined network.',
                from: startStation.name,
                to: endStation.name
            });
        }

        const options = foundPaths.map((p, idx) => {
            const uniqueRoutes = [...new Set(p.route.map(r => r.routeName).filter(Boolean))];
            return {
                ...p,
                id: idx,
                via: uniqueRoutes.length > 0 ? uniqueRoutes.join(" & ") : "Direct Line",
                from: startStation.name,
                fromCode: startStation.code,
                to: endStation.name,
                toCode: endStation.code
            };
        });

        if (options.length > 1) {
            return res.json({ multipleOptions: true, options });
        }
        res.json(options[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Helper function to detect how many different routes were used
function detectRoutesUsed(path) {
    if (path.length === 0) return 0;
    const routesSet = new Set();
    path.forEach(seg => {
        if (seg.routeName) routesSet.add(seg.routeName);
    });
    return routesSet.size || 1;
}

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
