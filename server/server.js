const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(cors());
app.use(express.json());

// --- AUTHENTICATION ENDPOINTS ---

// Updated Register Route in server.js
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(username)) {
        return res.status(400).json({ error: "Invalid email format." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, password) VALUES (?, ?)', 
            [username, hashedPassword]
        );
        res.status(201).json({ message: "User created", userId: result.insertId });
    } catch (err) {
        console.error("REGISTRATION ERROR:", err); // THIS WILL SHOW THE REAL ERROR IN YOUR TERMINAL

        // Check if the error is actually a duplicate email
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "This email is already registered." });
        }

        // If it's something else, tell us what it actually is
        res.status(500).json({ error: "Database error: " + err.message });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, users[0].password);
        if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { userId: users[0].id }, 
            process.env.JWT_SECRET || 'your_secret_key', 
            { expiresIn: '7d' }
        );

        res.json({ 
            token, 
            username: users[0].username, 
            userId: users[0].id 
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// --- MOOD LOGGING ENDPOINT (Updated with dynamic userId) ---
app.post('/api/log/mood', async (req, res) => {
    const { userId, feelingName, severity, isMeltdown, diaryNotes } = req.body;

    if (!userId || !feelingName || severity === undefined) {
        return res.status(400).json({ error: 'Missing required data.' });
    }

    try {
        const [feelingResult] = await pool.query(
            'SELECT feeling_id FROM feelings WHERE name = ?',
            [feelingName]
        );

        if (feelingResult.length === 0) {
            return res.status(404).json({ error: `Invalid feeling name: ${feelingName}.` });
        }

        const feelingId = feelingResult[0].feeling_id;

        const [result] = await pool.query(
            `INSERT INTO log_entry (user_id, feeling_id, severity_level, is_meltdown, diary_notes)
             VALUES (?, ?, ?, ?, ?)`,
            [userId, feelingId, severity, isMeltdown, diaryNotes]
        );

        res.status(201).json({ message: 'Mood logged successfully', logId: result.insertId });
    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});