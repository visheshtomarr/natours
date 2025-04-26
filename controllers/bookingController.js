const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');

const getCheckoutSession = catchAsync(async (req, res, next) => {
    // Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
                    },
                    unit_amount: tour.price * 100 // Converted to cents
                },
                quantity: 1
            },
        ],
        mode: 'payment'
    });

    // Send it to the client
    res.status(200).json({
        status: 'success',
        session
    });
});

const createBookingCheckout = catchAsync(async (req, res, next) => {
    const { tour, user, price } = req.query;

    if (!tour || !user || !price) return next();
    await Booking.create({ tour, user, price });

    // We will redirect to homepage if there is no data in query.
    res.redirect(req.originalUrl.split('?')[0]);
});

module.exports = {
    getCheckoutSession,
    createBookingCheckout
}