const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const saltRounds = 10;

// In-memory user store (for demonstration purposes)
const users = [];

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// API endpoint for user sign-up
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Check if user already exists
        if (users.find(user => user.email === email)) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Store the new user with the hashed password
        const newUser = { email, password: hashedPassword };
        users.push(newUser);

        console.log('User signed up:', { email: newUser.email }); // Don't log the hashed password
        console.log('All users:', users.map(u => ({ email: u.email })));

        res.status(201).json({ message: 'Sign-up successful!' });
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
