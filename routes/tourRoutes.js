const express = require('express');
const {
    getAlltours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan,
    getToursWithin,
    getDistances,
    uploadTourImages,
    resizeTourImages
} = require('./../controllers/tourController');

const { protected, restrictedTo } = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// // A param middleware to check whether the id is valid or not.
// router.param('id', checkId);

// Nested route for tour review
router.use('/:tourId/reviews', reviewRouter);

// Route to get the top 5 rated and cheapest tours.
router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAlltours);

// Route to get the stats of tours.
router
    .route('/tour-stats')
    .get(getTourStats);

// Route to get monthly plan for tours.
router
    .route('/monthly-plan/:year')
    .get(
        protected,
        restrictedTo('admin', 'lead-guide', 'guide'),
        getMonthlyPlan
    );

// Route to get tours within a certain distance.
router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getToursWithin);

// Route to get distances
router
    .route('/distances/:latlng/unit/:unit')
    .get(getDistances);

router
    .route('/')
    .get(getAlltours)
    .post(protected, restrictedTo('admin', 'lead-guide'), createTour);

router
    .route('/:id')
    .get(getTour)
    .patch(
        protected,
        restrictedTo('admin', 'lead-guide'),
        uploadTourImages,
        resizeTourImages,
        updateTour
    )
    .delete(protected, restrictedTo('admin', 'lead-guide'), deleteTour);

module.exports = router;