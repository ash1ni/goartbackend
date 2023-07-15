// usersController.js
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const passport = require('passport');
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);
const LocalStrategy = require('passport-local').Strategy;
// Passport Local Strategy for authenticating users
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await User.getUserByUsername(username);

        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const UserController = {
  async register(req, res) {
    try {
      const {id, username, password, email, first_name, last_name, user_role, status } = req.body;

      const user = await User.createUser(
        id,
        username,
        password,
        email,
        first_name,
        last_name,
        user_role,
        status
      );

      res.status(201).json({ success: true, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async login(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Internal server error' });
      }
      if (!user) {
        return res.status(401).json({ success: false, error: info.message });
      }
      req.login(user, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: 'Internal server error' });
        }
        return res.status(200).json({ success: true, user });
      });
    })(req, res, next);
  },
  async logout(req, res) {
    req.logout((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Internal server error' });
      }
      return res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
  },

  async getAllUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      res.status(200).json({ success: true, users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.getUserById(id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async updateUserCredentials(req, res) {
    try {
      const { id } = req.params;
      const { username, password, email } = req.body;

      const existingUser = await User.getUserById(id);
      if (!existingUser) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // You can add more validation checks if needed, e.g., username uniqueness, email format, etc.

      const updatedUser = await User.updateUserCredentials(id, username, password, email);

      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },
};

module.exports = UserController;
