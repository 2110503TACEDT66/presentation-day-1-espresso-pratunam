const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const {protect, authorize} = require("../middleware/authMiddleware");
const bookingRouter = require("./bookingRoute");

const {getCars, createCar, getCar, updateCar, deleteCar} = require("../controllers/carController");

// ANCHOR redirect to bookingRouter
router.use('/:carId/bookings', bookingRouter);


// ANCHOR getCar and createCar
//getCars : public
//createCar admin, provider
router.route('/')
    .get(getCars)
    .post(protect, authorize('admin'), createCar);


// ANCHOR getCar updateCar and deleteCar
//getCar : public
//updateCar : admin, user
//deleteCar : admin, user
router.route('/:id')
    .get(getCar)
    .put(protect, authorize('admin'), updateCar)
    .delete(protect, authorize('admin'), deleteCar);


module.exports = router;