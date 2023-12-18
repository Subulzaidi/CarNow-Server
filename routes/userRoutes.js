const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const db = require('../database'); // Import your database connection module
const {Login,Register} = require('../controllers/userController');

const router = express.Router();

// Login route
router.post(
  '/login',
  [
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password is required').notEmpty(),
  ],
  Login
);
router.post(
  '/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
 Register // Use the registerUser function from the userController
);

module.exports = router;
