const express = require('express');
const { getCheckoutSession, getAllBookings, getBooking, createBooking, updateBooking, deleteBooking } = require('./../controllers/bookingController');
const { protected, restrictedTo } = require('./../controllers/authController');

const router = express.Router();

router.use(protected);
router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(restrictedTo('admin', 'lead-guide'));
router
    .route('/')
    .get(getAllBookings)
    .post(createBooking);

router
    .route('/:id')
    .get(getBooking)
    .patch(updateBooking)
    .delete(deleteBooking);


module.exports = router;