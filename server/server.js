const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
// Render automatically provides a PORT, otherwise it defaults to 3000
const port = process.env.PORT || 3000;

// Optimized Pool for Railway
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306, // Added explicit port
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { rejectUnauthorized: false } // Required by some cloud providers for secure connection
});

app.use(cors());
app.use(express.json());

// --- AUTHENTICATION ENDPOINTS ---

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
        console.error("REGISTRATION ERROR:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "This email is already registered." });
        }
        res.status(500).json({ error: "Database error" });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(401).json({ error: "Invalid credentials" });
        
        const validPassword = await bcrypt.compare(password, users[0].password);
        if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { userId: users[0].id }, 
            process.env.JWT_SECRET, // Uses your Render variable
            { expiresIn: '7d' }
        );

        res.json({ 
            token, 
            username: users[0].username, 
            userId: users[0].id 
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// --- MOOD LOGGING ENDPOINT ---
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
            return res.status(404).json({ error: `Invalid feeling name.` });
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

// --- DASHBOARD STATS ENDPOINT ---
app.get('/api/dashboard/stats/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const statsQuery = `
            SELECT 
                COUNT(*) AS total_all_time,
                COUNT(CASE WHEN timestamp >= NOW() - INTERVAL 30 DAY THEN 1 END) AS total_month,
                COUNT(CASE WHEN timestamp >= NOW() - INTERVAL 7 DAY THEN 1 END) AS total_week
            FROM log_entry 
            WHERE user_id = ? AND is_meltdown = 1
        `;
        const [results] = await pool.query(statsQuery, [userId]);
        res.json(results[0]);
    } catch (err) {
        console.error('Dashboard Stats Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- WELLBEING CHECK ENDPOINT ---
app.get('/api/check-wellbeing/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [recentLogs] = await pool.query(
            'SELECT is_meltdown FROM log_entry WHERE user_id = ? ORDER BY timestamp DESC LIMIT 3',
            [userId]
        );

        if (recentLogs.length < 3) {
            return res.json({ status: 'neutral' });
        }

        const isHardStreak = recentLogs.every(log => log.is_meltdown == 1);
        const isPositiveStreak = recentLogs.every(log => log.is_meltdown == 0);     

        if (isHardStreak) {
            res.json({ status: 'crisis' });
        } else if (isPositiveStreak) {
            res.json({ status: 'positive' });
        } else {
            res.json({ status: 'neutral' });
        }
    } catch (err) {
        console.error('Wellbeing Check Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// The '0.0.0.0' allows Render to route external traffic to your app
app.listen(port, '0.0.0.0', () => {
    console.log(`Backend is live and listening on port ${port}`);
});