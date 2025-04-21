const express = require('express');
const { getOverview, getTour, getLoginForm } = require('../controllers/viewController');
const { protected, isLoggedIn } = require('./../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/tour/:slug', protected, getTour);
router.get('/login', getLoginForm);

module.exports = router;