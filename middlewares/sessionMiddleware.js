const express = require('express')
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
require('dotenv').config();
const {pool} = require('../config/dbConfig');


const sessionMiddleware = session({
    store: new pgSession({
        // Configure the PostgreSQL connection details
        conString: "postgres://postgres:password@localhost/postgres",
        tableName: "session",
      }),
      secret: process.env.SESSION_SECRET, // Replace with your own session secret
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // Set the session duration (30 days in this example)
        secure: true, // Set to true if using HTTPS
        httpOnly: true,
      }
});
// app.use(passport.initialize());
// app.use(passport.session());

module.exports = sessionMiddleware;
