const connectDB = require("../config/dbconnection");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/Auth");
const { validationResult } = require('express-validator');

const Register = async (req, res) => {
  // Validate the request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, password2, address, phoneNo, gender } = req.body;
  if (!username || !password || !password2 || !email || !address || !phoneNo || !gender) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const connection = await connectDB();

    // Check if email is already taken
    const [existingUser] = await connection.execute('SELECT email FROM user WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.json({ error: "Email is taken" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert user into the database
    const [insertResult] = await connection.execute(
      'INSERT INTO user (username, email, password, address, phoneNo, gender) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, password, address, phoneNo, gender]
    );

    return res.json({ message: "User registered!" });
  } catch (error) {
    console.error("Internal server error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const connection = await connectDB();

    // Query for user login
    const [results] = await connection.execute('SELECT * FROM user WHERE email = ? AND password = ?', [email, password]);

    // Check if the user exists
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // create a signed token
    const token = jwt.sign({ email: email }, process.env.secrets_cy_of_tc, {
      expiresIn: "4d",
    });

    res.json({ user: results[0], token });
  } catch (error) {
    console.error("Internal server error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
  
module.exports = {
  Register,
  Login
};
