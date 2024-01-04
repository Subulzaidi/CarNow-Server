const connectDB = require("../config/dbconnection");
const bcrypt = require("bcrypt");

class UserModel {
  async registerUser({
    firstName,
    lastName,
    email,
    Phone,
    address,
    dateOfBirth,
    driverLicenseNumber,
    password,
    gender,
  }) {
    try {
      const connection = await connectDB();

      // Check if email is already taken
      const [existingUser] = await connection.execute(
        "SELECT email FROM users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        return { error: "Email is taken" };
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert user into the database with hashed password
      const [insertResult] = await connection.execute(
        "INSERT INTO users (FirstName, LastName, Email, Phone, Address, DateOfBirth, DriverLicenseNumber, PasswordHash, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          firstName,
          lastName,
          email,
          Phone,
          address,
          dateOfBirth,
          driverLicenseNumber,
          password,
          gender,
        ]
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
        "SELECT * FROM users WHERE Email = ?",
        [email]
      );

      // Check if the user exists
      if (results.length === 0) {
        return { error: "Invalid credentials" };
      }

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(
        password,
        results[0].PasswordHash
      );

      if (!isPasswordValid) {
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
