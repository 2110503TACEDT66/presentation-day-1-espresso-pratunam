const express = require('express');
const {getBookings, getBooking, addBooking, updateBooking, deleteBooking} = require('../controllers/bookingController');
const router = express.Router({mergeParams: true});
const {protect, authorize} = require('../middleware/authMiddleware');

// ANCHOR getBookings and addBooking
// getBookings : admin, user
// addBooking : admin, user
router.route('/')
    .get(protect, authorize('admin','user'), getBookings)
    .post(protect, authorize('admin', 'user'), addBooking);


// ANCHOR getBooking, updateBooking and deleteBooking
//getBooking : admin, user
//updateBooking : admin, user
//deleteBooking : admin, user
router.route('/:id')
    .get(protect, authorize('admin', 'user'), getBooking)
    .put(protect, authorize('admin', 'user'), updateBooking)
    .delete(protect, authorize('admin', 'user'), deleteBooking);


//export
module.exports = router;
