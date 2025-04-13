const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Sign up
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.send('All fields are required.');
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');

  const exists = users.find(user => user.email === email);
  if (exists) {
    return res.send('User already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, email, password: hashedPassword });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.send('Sign up successful! You can now <a href="login.html">login</a>.');
});

// Login 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.send('Invalid email or password.');
  }

  res.send(`Welcome, ${user.username}!`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
