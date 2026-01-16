# DATA ARCHITECTURE - RUNNING LOG BOOK

## ✅ CURRENT STATUS: FULLY DATABASE-DRIVEN

All static data has been migrated to MongoDB Atlas. The application no longer relies on hardcoded data files.

---

## 📊 DATABASE COLLECTIONS

### 1. **stations** Collection
- **Purpose**: Stores all railway station information
- **Schema**: 
  ```javascript
  {
    code: String,           // Station code (e.g., "NJP", "KNE")
    name: String,           // Full station name (e.g., "NEW JALPAIGURI JN")
    zone: String,           // Railway zone (e.g., "NFR")
    division: String,       // Division (e.g., "KIR")
    kmFromOrigin: Number,   // Absolute KM marker
    nextStation: {          // Linked list pointer
      code: String,
      name: String,
      distanceKm: Number
    },
    prevStation: {          // Linked list pointer
      code: String,
      name: String,
      distanceKm: Number
    }
  }
  ```
- **Current Count**: 20 stations (BOE to NJP route)
- **API Endpoint**: `GET /api/stations`

### 2. **users** Collection
- **Purpose**: User authentication and profile data
- **Schema**:
  ```javascript
  {
    name: String,
    designation: String,
    cmsId: String (unique),
    password: String,
    createdAt: Date
  }
  ```
- **API Endpoints**: 
  - `POST /api/register`
  - `POST /api/login`

### 3. **usersections** Collection
- **Purpose**: User-specific manual route sections
- **Schema**:
  ```javascript
  {
    cmsId: String,
    fromStation: String,
    toStation: String,
    distance: Number,
    sectionName: String,
    createdAt: Date
  }
  ```
- **API Endpoints**:
  - `GET /api/user-sections/:cmsId`
  - `POST /api/user-sections`

### 4. **sections** Collection
- **Purpose**: Global railway section data (legacy)
- **Status**: Available but not actively used in current UI
- **API Endpoint**: `GET /api/sections`

---

## 🔍 SEARCH FUNCTIONALITY

### Station Search Component
**Location**: `src/components/ui/StationSearchInput.jsx`

**Features**:
- ✅ Searches by **STATION CODE** (e.g., "KNE")
- ✅ Searches by **FULL NAME** (e.g., "Kishanganj")
- ✅ Case-insensitive matching
- ✅ Real-time dropdown suggestions
- ✅ Fetches data from database API (not static files)

**Implementation**:
```javascript
const filtered = allStations.filter(station =>
    station.code.includes(inputVal) ||
    (station.name && station.name.toUpperCase().includes(inputVal))
);
```

**Used In**:
- Sign On page (Station field)
- Settings > Calculator (Station 1 & 2)
- Settings > Sections (From & To fields)

---

## 🗂️ LEGACY FILES (NOT IN USE)

The following files exist but are **NOT imported** anywhere in the application:

- `src/data/stations.js` - Can be safely deleted
- `src/data/sections.js` - Can be safely deleted
- `src/data/user.js` - Still used for mock profile data

**Verification**: No active imports found via codebase search.

---

## 🚀 ROUTE CALCULATION API

**Endpoint**: `GET /api/route?from=CODE1&to=CODE2`

**Example**: `/api/route?from=BOE&to=KNE`

**Response**:
```json
{
  "origin": "BARSOI Jn",
  "destination": "Kishanganj",
  "totalDistance": 57.26,
  "route": [
    {"from": "BOE", "to": "SJGM", "distance": 7.87},
    {"from": "SJGM", "to": "SUD", "distance": 4.04},
    ...
  ]
}
```

**Algorithm**: Linked-list traversal using `nextStation`/`prevStation` pointers

---

## 📝 RECOMMENDATIONS

1. ✅ **Delete Static Files**: Remove `src/data/stations.js` and `src/data/sections.js`
2. ✅ **Database Seeding**: Use `seed_linked.js` to populate new routes
3. ✅ **Backup**: All data is in MongoDB Atlas (cloud backup enabled)
4. ⚠️ **User Data**: Consider moving `src/data/user.js` to database or context

---

## 🔐 DATABASE CONNECTION

- **Host**: MongoDB Atlas (cluster0.rwxvzfk.mongodb.net)
- **Database**: `running_log_book`
- **Config**: `server/.env` (MONGO_URI)
- **Status**: ✅ Connected and operational

---

**Last Updated**: 2026-01-16
**Total Stations**: 20
**Total API Endpoints**: 8
