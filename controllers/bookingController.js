const Booking = require('../models/Booking');
const Car = require('../models/Car');
const {googleAuthorize, sendMessage} = require('../utils/mailUtils');

// @route GET/bookings/
// @access Public


exports.getBookings = async (req, res, next) => {
    let query;

    if (req.user.role !== 'admin') {
        query = Booking.find({ UserID: req.user.id });
    } else {
        if (req.params.carId) { // Corrected from req.parems.carId to req.params.carId
            console.log(req.params.carId);
            query = Booking.find({ CarID: req.params.carId }); // Corrected from req.parems.carId to req.params.carId
        } else {
            query = Booking.find().populate('User');
        }
    }

    try {
        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            data: err,
            msg: "Cannot find bookings"
        });
    }
};


// @route GET/bookings/:id
// @access Public

exports.getBooking = async(req,res,next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if(!booking) {
            return res.status(404).json({
                success: false,
                msg: 'No booking with the id of :' + req.params.id
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Cannot find Booking"
        });
    }
}



// @route POST/cars/:id/bookings
// @access Private

exports.addBooking = async (req, res, next) => {
    try {
        req.body.CarID = req.params.carId;

        const car = await Car.findById(req.params.carId);

        if(!car) {
            return res.status(404).json({
                success: false,
                msg: 'No car with the id of :' + req.params.carId
            });
        }

        //add user Id to req.body
        req.body.user = req.user.id;
        const existedBookings = await Booking.find({
            UserID: req.user.id
        });

        if(existedBookings.length >= 3 && req.user.role !== 'admin') {
            return res.status(404).json({
                success: false,
                msg: 'The user with ID ' + req.user.id + ' already made 3 Bookings'
            });
        }

        const booking = await Booking.create(req.body);

const emailBody =
`Dear ${req.user.name},

<p>Thank you for booking with us. This email confirms your rental car reservation. Please find your booking details below:</p>
<p>
            <b>Booking ID:</b> ${req.body.id} <br/>
            <b>Car:</b> ${req.body.CarID} <br/>
            <b>Provider:</b> ${req.body.ProviderID} <br/>
            <b>Start Date:</b> ${new Date(req.body.StartDate).toLocaleDateString()} <br/>
            <b>End Date:</b> ${new Date(req.body.EndDate).toLocaleDateString()} <br/>
</p>

<p>Thank you for choosing Espresso Pratunam Car Renting. We trust you'll have a great experience. If you have any questions, please don't hesitate to contact us.</p>

<p>Sincerely,<br/>
Espresso Pratunam Car Renting</p>`;

        // console.log(emailBody)
        googleAuthorize().then(sendMessage('nattapon.how@gmail.com', req.user.email, 'Car Rental Confirmation', emailBody)).catch(console.error);
        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            data: err,
            msg: "Cannot add booking"
        });
    }
}

// @route PUT/bookings/:id
// @access Private

exports.updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id)
        if(!booking) {
            return res.status(404).json({
                success: false,
                msg: 'No booking with the id of :' + req.params.id
            });
        }

        if(booking.UserID.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                msg: 'User' + req.user.id + 'is not authorized to update this booking'
            });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            data: err,
            msg: "Cannot update to booking"
        });
    }
};


// @route DELETE/bookings:id
// @access Private

exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if(!booking) {
            return res.status(404).json({
                success: false,
                msg: 'No booking with the id of :' + req.params.id
            });
        }

        if(booking.UserID.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                msg: 'User' + req.user.id + 'is not authorized to delete this booking'
            });
        }

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Cannot delete booking"
        });
    }
};
