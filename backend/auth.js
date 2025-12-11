const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const openDb = require('./database');

const signup = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const db = await openDb();
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        await db.run(sql, [username, hashedPassword]);
        res.status(201).send('User created');
    } catch (err) {
        res.status(409).send('Username already exists');
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const db = await openDb();
        const sql = 'SELECT * FROM users WHERE username = ?';
        const user = await db.get(sql, [username]);

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
};

module.exports = { signup, login };
