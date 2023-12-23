const asyncHandler = require("express-async-handler");
const connectDB = require("../config/dbconnection");
// Import any necessary modules and models as needed

// @desc Get all car rentals
// @route GET /api/carrentals
// @access Public
const getAllCarRentals = asyncHandler(async (req, res) => {
  try {
    const connection = await connectDB();
    const [rows, fields] = await connection.query("SELECT * FROM cars ");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Get details of a specific car rental by ID
// @route GET /api/carrentals/:id
// @access Public
const getCarRentalById = asyncHandler(async (req, res) => {
  try {
    const connection = await connectDB();
    const [rows, fields] = await connection.query(
      "SELECT * FROM cars WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Car rental not found" });
      return;
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Update specific car rental by ID
// @route PUT /api/carrentals/:id
// @access Public
const updateCarRental = asyncHandler(async (req, res) => {
  try {
    const connection = await connectDB();
    const { name, email, contact } = req.body;

    if (!name || !email || !contact) {
      res.status(400).json({ message: "All fields are mandatory!" });
      return;
    }

    await connection.query(
      "UPDATE cars SET name = ?, email = ?, contact = ? WHERE id = ?",
      [name, email, contact, req.params.id]
    );

    res
      .status(200)
      .json({ message: `Update car rental for ID ${req.params.id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Delete specific car rental by ID
// @route DELETE /api/carrentals/:id
// @access Public
const deleteCarRental = asyncHandler(async (req, res) => {
  try {
    const connection = await connectDB();
    await connection.query("DELETE FROM cars WHERE id = ?", [req.params.id]);
    res
      .status(200)
      .json({ message: `Delete car rental for ID ${req.params.id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  getAllCarRentals,
  getCarRentalById,
  updateCarRental,
  deleteCarRental,
};
