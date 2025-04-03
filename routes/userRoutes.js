const express = require('express');
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('./../controllers/userController');
const { signup, login, forgotPassword, resetPassword, protected, updatePassword } = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/forgetPassword').post(forgotPassword);
router.route('/resetPassword/:token').patch(resetPassword);
router.route('/updatePassword').patch(protected, updatePassword);

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;