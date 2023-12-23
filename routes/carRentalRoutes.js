const express = require("express");
const router = express.Router();
const carrentalController = require("../controllers/carrentalController");

router.get("/carrentals", carrentalController.getAllCarRentals);

router.get("/carrentals/:id", carrentalController.getCarRentalById);

router.put("/carrentals/:id", carrentalController.updateCarRental);

router.delete("/carrentals/:id", carrentalController.deleteCarRental);

module.exports = router;
