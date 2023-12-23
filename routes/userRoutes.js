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
  '/signup',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('password2', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('address', 'Adrdress is required').notEmpty(),
    check('phoneNo', 'Phone no is required').notEmpty(),
    check('gender', 'Gender is required').notEmpty(),

  ],
 Register // Use the registerUser function from the userController
);

module.exports = router;
