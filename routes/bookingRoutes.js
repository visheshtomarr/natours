const express = require('express');
const { getCheckoutSession } = require('./../controllers/bookingController');
const { protected } = require('./../controllers/authController');

const router = express.Router();

router.get(
    '/checkout-session/:tourId',
    protected,
    getCheckoutSession
);

module.exports = router;