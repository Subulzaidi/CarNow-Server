// controllers/userController.js

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const user = new User();

const registerUser = async (req, res) => {
  // Validate the request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, address, phoneNo, gender } = req.body;
  if (!username || !password || !email || !address || !phoneNo || !gender) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const result = await user.registerUser(
    username,
    email,
    password,
    address,
    phoneNo,
    gender
  );
  return res.json(result);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const result = await user.loginUser(email, password);

  if (!result.error) {
    // Generate a token
    const token = jwt.sign(
      { userId: result.user.id },
      process.env.secrets_cy_of_tc,
      {
        expiresIn: "4d", // You can customize the expiration time
      }
    );

    // Omit sensitive information from the response
    result.user.password = undefined;

    return res.json({ token, ...result });
  } else {
    return res.status(401).json(result);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
