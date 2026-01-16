// 6. Route Calculation (Linked List Logic)
app.get('/api/route', async (req, res) => {
    try {
        const { from, to } = req.query;
        if (!from || !to) return res.status(400).json({ message: 'From and To station codes required' });

        const startStation = await Station.findOne({ code: from });
        const endStation = await Station.findOne({ code: to });

        if (!startStation || !endStation) return res.status(404).json({ message: 'Stations not found' });

        const goNext = startStation.kmFromOrigin < endStation.kmFromOrigin;

        let current = startStation;
        let route = [];
        let totalDistance = 0;
        let visited = new Set();
        let safetyCounter = 0;

        while (current && current.code !== endStation.code) {
            if (visited.has(current.code)) break;
            if (safetyCounter++ > 100) break; // Prevent infinite chunks
            visited.add(current.code);

            const nextLink = goNext ? current.nextStation : current.prevStation;

            if (!nextLink || !nextLink.code) break;

            route.push({
                from: current.code,
                to: nextLink.code,
                distance: nextLink.distanceKm
            });

            totalDistance += nextLink.distanceKm;
            current = await Station.findOne({ code: nextLink.code });
        }

        res.json({
            origin: startStation.name,
            destination: endStation.name,
            totalDistance: parseFloat(totalDistance.toFixed(2)),
            route: route
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
