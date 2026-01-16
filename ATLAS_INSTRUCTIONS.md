# 🌍 How to Connect & Seed MongoDB Atlas

You have requested to connect your app to **MongoDB Atlas** (Cloud).

## Step 1: Get Your Connection String
1. Log in to your **MongoDB Atlas Dashboard**.
2. Click **Connect** on your Cluster.
3. Select **Drivers** (Node.js).
4. Copy the connection string. It will look like:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/running_log_book?retryWrites=true&w=majority`
5. **Important**: Replace `<password>` with your actual database user password.

---

## Step 2: Configure the Server
1. Open the file: `server/.env`
2. Paste your connection string accurately:
   ```env
   MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.../running_log_book?retryWrites=true&w=majority
   ```
3. Save the file.
4. **Restart your server**:
   - Go to your server terminal.
   - Press `Ctrl + C` to stop it.
   - Run `node index.js` again.
   - It should say: `✅ MongoDB Connected to mongodb+srv://...`

---

## Step 3: Populate the Cloud Database (Seed)
Your cloud database starts empty. You need to upload your stations/sections data.

1. Open a terminal in your project root (`e:\My Projects\RUNNING LOG BOOK`).
2. Run the seed script passing your connection string in quotes:
   ```bash
   node seed_db.js "mongodb+srv://myuser:mypassword@cluster0.../running_log_book?retryWrites=true&w=majority"
   ```
   *(Alternatively, if you already set the .env variable in the root, just run `node seed_db.js`).*

---

## ✅ Verification
1. Open your App in the browser.
2. Go to **Sign On**.
3. If the dropdown loads stations, you are successfully connected to the Cloud!
