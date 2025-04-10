const express = require('express');
const {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    setTourUserIds,
    getReview
} = require('./../controllers/reviewController');
const { protected, restrictedTo } = require('./../controllers/authController');

// Merge params will get access to 'tourId' from the parent route.
const router = express.Router({ mergeParams: true });

router.use(protected);

router
    .route('/')
    .get(getAllReviews)
    .post(restrictedTo('user'), setTourUserIds, createReview);

router
    .route('/:id')
    .get(getReview)
    .patch(restrictedTo('user', 'admin'), updateReview)
    .delete(restrictedTo('user', 'admin'), deleteReview);

module.exports = router;