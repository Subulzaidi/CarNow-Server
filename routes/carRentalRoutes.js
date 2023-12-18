const express = require("express");
const router = express.Router();
const carrentalController = require("../controllers/carrentalController");

router.get('/', carrentalController.getAllCarRentals);

router.post('/', carrentalController.createCarRental);

router.get('/:id', carrentalController.getCarRentalById);

router.put('/:id', carrentalController.updateCarRental);

router.delete('/:id', carrentalController.deleteCarRental);

module.exports = router;
