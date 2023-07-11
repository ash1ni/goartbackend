// usersController.js
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Handle POST /users
const createUser = async (req, res) => {
  try {
    // Check if the user has the necessary role to create a new user
    if (req.session.userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { username, password, email, first_name, last_name, user_role, status } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      first_name,
      last_name,
      user_role,
      status,
    };

    const createdUser = await User.create(newUser);

    res.json(createdUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Handle POST /users/login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        req.session.username = user.username;
        req.session.userRole = user.user_role;
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Handle GET /users/profile
 const getUserProfile = async (req, res) => {
  const username = req.session.username;
  const userRole = req.session.userRole;

  try {
    const userProfile = await User.findByUsername(username);
    res.json({ username, userRole, profileData: userProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
    createUser,
    loginUser,
    getUserProfile,
}