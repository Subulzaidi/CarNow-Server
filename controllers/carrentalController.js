const asyncHandler = require("express-async-handler");
// Import any necessary modules and models as needed

// @desc Get all car rentals
// @route GET /api/carrentals
// @access Public 
const getAllCarRentals = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Get car rental details for ID" });
});

// @desc Create a new car rental
// @route POST /api/carrentals
// @access Public
const createCarRental = asyncHandler(async(req, res) => {
    console.log("The request body is" , req.body);
    const {name,email,contact}= req.body;
    if(!name || !email || !contact){
        res.status(400);
        throw new Error("All fields are mandatory ! ");
    }
    res.status(200).json({ message: "Create a new car rental" });
});

// @desc Get details of a specific car rental by ID
// @route GET /api/carrentals/:id
// @access Public
const getCarRentalById = asyncHandler(async(req, res) => {
    res.status(200).json({ message: `Get car rental details for ID ${req.params.id}` });
});

// @desc Update specific car rental by ID
// @route PUT /api/carrentals/:id
// @access Public
const updateCarRental = asyncHandler(async(req, res) => {
    res.status(200).json({ message: `Update car rental for ID ${req.params.id}` });
});

// @desc Delete specific car rental by ID
// @route DELETE /api/carrentals/:id
// @access Public
const deleteCarRental = asyncHandler(async(req, res) => {
    res.status(200).json({ message: `Delete car rental for ID ${req.params.id}` });
});

module.exports = {
    getAllCarRentals,
    createCarRental,
    getCarRentalById,
    updateCarRental,
    deleteCarRental,
};
