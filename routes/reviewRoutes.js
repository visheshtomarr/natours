const express = require('express');
const { getAllReviews, createReview } = require('./../controllers/reviewController');
const { protected, restrictedTo } = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(getAllReviews)
    .post(protected, restrictedTo('user'), createReview);

module.exports = router;