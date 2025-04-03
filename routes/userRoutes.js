const express = require('express');
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe
} = require('./../controllers/userController');
const { signup, login, forgotPassword, resetPassword, protected, updatePassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgetPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protected, updatePassword);
router.patch('/updateMe', protected, updateMe);

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