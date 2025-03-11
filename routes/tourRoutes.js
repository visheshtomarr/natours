const express = require('express');
const {
    getAlltours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    checkId,
    checkBody
} = require('./../controllers/tourController');

const router = express.Router();

// A param middleware to check whether the id is valid or not.
router.param('id', checkId);

router
    .route('/')
    .get(getAlltours)
    .post(checkBody, createTour);

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;