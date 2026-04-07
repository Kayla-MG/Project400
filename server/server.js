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
        res.status(500).json({ error: "Database error: " + err.message });
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

// --- NEW: DASHBOARD STATS ENDPOINT ---
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

app.get('/api/check-wellbeing/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Fetch the 3 most recent logs
        const [recentLogs] = await pool.query(
            'SELECT is_meltdown FROM log_entry WHERE user_id = ? ORDER BY timestamp DESC LIMIT 3',
            [userId]
        );

        // We only trigger if we actually have at least 3 logs
        if (recentLogs.length < 3) {
            return res.json({ status: 'neutral' });
        }

        // Check for 3 Meltdowns in a row
        //const isHardStreak = recentLogs.every(log => Number(log.is_meltdown) === 1);
    
        // Check for 3 Positive entries in a row (No meltdowns)
        //const isPositiveStreak = recentLogs.every(log => Number(log.is_meltdown) === 0);
        
        // Replace your current streak lines with these:
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
// The '0.0.0.0' is the magic part—it tells Node to accept outside connections
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is LIVE on your network at http://192.168.5.227:${port}`);
});
