const express = require('express');
const { getAllReviews, createReview } = require('./../controllers/reviewController');
const { protected, restrictedTo } = require('./../controllers/authController');

// Merge params will get access to 'tourId' from the parent route.
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getAllReviews)
    .post(protected, restrictedTo('user'), createReview);

module.exports = router;