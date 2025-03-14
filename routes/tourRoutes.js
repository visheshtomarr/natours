const express = require('express');
const {
    getAlltours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours
} = require('./../controllers/tourController');

const router = express.Router();

// // A param middleware to check whether the id is valid or not.
// router.param('id', checkId);

// Route to get the top 5 rated and cheapest tours.
router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAlltours);

router
    .route('/')
    .get(getAlltours)
    .post(createTour);

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;