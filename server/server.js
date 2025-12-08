const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise'); // Using async/await version

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// --- Database Connection Pool ---
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware
app.use(cors()); // Allow requests from your React Native app
app.use(express.json()); // Enable parsing JSON request bodies

// --- Endpoint: Log a New Mood Entry ---
// React Native app POSTs to this endpoint when the user hits "Save Log"
app.post('/api/log/mood', async (req, res) => {
    const { userId, feelingName, severity, isMeltdown, diaryNotes } = req.body;

    if (!userId || !feelingName || severity === undefined) {
        return res.status(400).json({ error: 'Missing required data.' });
    }

    try {
        // --- Step 1: Ensure User Exists (Simulated Auth Check) ---
        // In a real system, you would check auth tokens, but here we ensure the user ID is in the DB.
        // We use a temporary query to insert the user if they don't exist yet.
        await pool.query(
            `INSERT IGNORE INTO users (user_id, username) VALUES (?, 'User_' + ?)`,
            [userId, userId.substring(0, 8)]
        );

        // --- Step 2: Get the numerical ID for the feeling name (Data Integrity Check) ---
        const [feelingResult] = await pool.query(
            'SELECT feeling_id FROM feelings WHERE name = ?',
            [feelingName]
        );

        if (feelingResult.length === 0) {
            return res.status(404).json({ error: `Invalid feeling name: ${feelingName}.` });
        }

        const feelingId = feelingResult[0].feeling_id;

        // --- Step 3: Insert the new log entry ---
        const [result] = await pool.query(
            `INSERT INTO log_entry (user_id, feeling_id, severity_level, is_meltdown, diary_notes)
             VALUES (?, ?, ?, ?, ?)`,
            [userId, feelingId, severity, isMeltdown, diaryNotes]
        );

        res.status(201).json({ message: 'Mood logged successfully', logId: result.insertId });

    } catch (err) {
        console.error('Database Error during logging:', err);
        res.status(500).json({ error: 'Internal server error during data insertion.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`API is ready to handle requests...`);
});