const express = require('express');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Connect to the database
const dbPath = path.resolve(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the users database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    session_token TEXT
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Users table created.');
  });
});

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '..')));

// Initialize Vertex AI
const vertex_ai = new VertexAI({
  project: 'ai-services-7abb5',
  location: 'us-central1',
});

const generativeModel = vertex_ai.getGenerativeModel({
  model: 'gemini-1.0-pro-001',
});

// API endpoint for the chatbot
app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;

  try {
    const streamResult = await generativeModel.generateContentStream(message);
    const response = await streamResult.response;
    res.json({ response: response.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// API endpoint for business idea feedback
app.post('/api/feedback', async (req, res) => {
  const { idea } = req.body;
  const prompt = `Provide feedback on the following business idea: ${idea}`;

  try {
    const streamResult = await generativeModel.generateContentStream(prompt);
    const response = await streamResult.response;
    res.json({ response: response.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(sql, [username, hashedPassword], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      console.error(err.message);
      return res.status(500).json({ error: 'Something went wrong' });
    }
    res.status(201).json({ message: 'User created successfully', userId: this.lastID });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const sql = `SELECT * FROM users WHERE username = ?`;
  db.get(sql, [username], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Something went wrong' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    bcrypt.compare(password, row.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      const token = uuidv4();
      const sql = `UPDATE users SET session_token = ? WHERE id = ?`;
      db.run(sql, [token, row.id], function(err) {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Something went wrong' });
        }
        res.json({ message: 'Login successful', token: token });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
