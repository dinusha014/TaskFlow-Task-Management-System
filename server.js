const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Temporary in-memory storage for users (will reset when server restarts)
const users = [];

// 1. Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, 'src', 'frontend')));

// --- ROUTES ---

// 2. Serve index.html from 'src'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// 3. Signup Logic
app.post('/signup', (req, res) => {
    const { fullname, username, email, password } = req.body;

    // Check if the user already exists
    const userExists = users.find(u => u.username === username);
    
    if (userExists) {
        return res.status(400).json({ message: "Username already taken" });
    }

    // Save the new user to our array
    users.push({ fullname, username, email, password });
    console.log(`New registration: ${username}`);

    res.status(201).json({ 
        message: "Account created successfully!", 
        redirect: "/login.html" 
    });
});

// 4. Updated Login Logic to check against our 'users' array
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Search for a user with a matching username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.status(200).json({ 
            message: `Welcome back, ${user.fullname}!`, 
            redirect: "/dashboard.html" 
        });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

app.listen(PORT, () => {
    console.log(`TaskFlow server is running at http://localhost:${PORT}`);
});