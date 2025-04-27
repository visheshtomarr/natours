const express = require('express');
const { getOverview, getTour, getLoginForm, getAccount, getMyTours, getSignupForm } = require('./../controllers/viewController');
const { protected, isLoggedIn } = require('./../controllers/authController');

const router = express.Router();

router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/signup', getSignupForm);
router.get('/me', protected, getAccount);
router.get('/my-tours', protected, getMyTours);

module.exports = router;