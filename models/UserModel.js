// models/User.js

const connectDB = require("../config/dbconnection");

class UserModel {
  async registerUser(username, email, password, address, phoneNo, gender) {
    try {
      const connection = await connectDB();

      // Check if email is already taken
      const [existingUser] = await connection.execute(
        "SELECT email FROM user WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        return { error: "Email is taken" };
      }

      // Insert user into the database
      const [insertResult] = await connection.execute(
        "INSERT INTO user (username, email, password, address, phoneNo, gender) VALUES (?, ?, ?, ?, ?, ?)",
        [username, email, password, address, phoneNo, gender]
      );

      return { message: "User registered!" };
    } catch (error) {
      console.error("Internal server error", error);
      return { error: "Internal server error" };
    }
  }

  async loginUser(email, password) {
    try {
      const connection = await connectDB();

      // Query for user login
      const [results] = await connection.execute(
        "SELECT * FROM user WHERE email = ? AND password = ?",
        [email, password]
      );

      // Check if the user exists
      if (results.length === 0) {
        return { error: "Invalid credentials" };
      }

      return { user: results[0] };
    } catch (error) {
      console.error("Internal server error", error);
      return { error: "Internal server error" };
    }
  }
}

module.exports = UserModel;
