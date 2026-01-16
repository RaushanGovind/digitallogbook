# How to Import Data into MongoDB Compass

I have converted your application data into JSON files that are ready for MongoDB Compass.

## 📂 Location of Files
You will find a new folder in your project called **`mongo_exports`**.
Inside are two files:
1. `stations.json`
2. `sections.json`

---

## 🚀 Import Instructions

### Step 1: Open MongoDB Compass
1. Open the **MongoDB Compass** application on your computer.
2. Connect to your database (e.g., `mongodb://localhost:27017` or your cloud URI).

### Step 2: Create a Database (if needed)
1. Click the green **+** button next to **Databases** (left sidebar).
2. **Database Name**: `running_log_book`
3. **Collection Name**: `stations`
4. Click **Create Database**.

### Step 3: Import Stations
1. Select the **`stations`** collection you just created.
2. Click the green **ADD DATA** button (middle of screen) → Select **Import JSON or CSV file**.
3. Browse to your project folder: `e:\My Projects\RUNNING LOG BOOK\mongo_exports\`
4. Select **`stations.json`**.
5. Ensure the file format is detected as **JSON**.
6. Click **IMPORT**.

### Step 4: Import Sections
1. In the left sidebar, click the **+** button next to your database name (`running_log_book`) to add a new collection.
2. Name it **`sections`**.
3. Click the green **ADD DATA** button → **Import JSON or CSV file**.
4. Select **`sections.json`** from the `mongo_exports` folder.
5. Click **IMPORT**.

---

## ✅ Verification
Once imported:
- You should see documents for items like `RPAN`, `MLDT`, `BOE` in the `stations` collection.
- You should see route documents like `NJP-APDJ-SMTA` in the `sections` collection.

Your data is now safely stored in MongoDB!
