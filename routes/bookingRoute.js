const express = require('express');
const {getBookings, getBooking, addBooking, updateBooking, deleteBooking} = require('../controllers/bookingController');
const router = express.Router({mergeParams: true});
const {protect, authorize} = require('../middleware/authMiddleware');

// ANCHOR getBookings and addBooking
// getBookings : admin, user, provider
// addBooking : admin, user
router.route('/')
    .get(protect, authorize('admin','user', 'provider'), getBookings)
    .post(protect, authorize('admin', 'user'), addBooking);


// ANCHOR getBooking, updateBooking and deleteBooking
//getBooking : admin, user, provider
//updateBooking : admin, user, provider
//deleteBooking : admin, user, provider
router.route('/:id')
    .get(protect, authorize('admin', 'user', 'provider'), getBooking)
    .put(protect, authorize('admin', 'user', 'provider'), updateBooking)
    .delete(protect, authorize('admin', 'user', 'provider'), deleteBooking);


//export
module.exports = router;
