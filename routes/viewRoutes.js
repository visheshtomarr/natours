const express = require('express');
const { getOverview, getTour, getLoginForm, getAccount } = require('../controllers/viewController');
const { protected, isLoggedIn } = require('./../controllers/authController');

const router = express.Router();

router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, protected, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protected, getAccount);

module.exports = router;