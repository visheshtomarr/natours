const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


const getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
});

const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!tour) {
        return next(new AppError('No tour found!', 404));
    }

    res.status(200).render('tour', {
        title: tour.name,
        tour
    });
});

const getLoginForm = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Login'
    });
};

module.exports = {
    getOverview,
    getTour,
    getLoginForm
}