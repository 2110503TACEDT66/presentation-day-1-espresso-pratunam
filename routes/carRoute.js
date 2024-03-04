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
    .post(protect, authorize('admin', ' provider'), createCar);


// ANCHOR getCar updateCar and deleteCar
//getCar : public
//updateCar : admin, provider
//deleteCar : admin, provider
router.route('/:id')
    .get(getCar)
    .put(protect, authorize('admin', 'provider'), updateCar)
    .delete(protect, authorize('admin', 'provider'), deleteCar);


module.exports = router;