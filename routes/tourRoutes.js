const express = require('express');
const {
    getAlltours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan
} = require('./../controllers/tourController');

const { protected } = require('./../controllers/authController');

const router = express.Router();

// // A param middleware to check whether the id is valid or not.
// router.param('id', checkId);

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
    .get(getMonthlyPlan);

router
    .route('/')
    .get(protected, getAlltours)
    .post(createTour);

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;