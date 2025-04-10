const express = require('express');
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
    getMe
} = require('./../controllers/userController');
const { signup, login, forgotPassword, resetPassword, protected, updatePassword } = require('../controllers/authController');
const { getOne } = require('../controllers/handlerFactory');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgetPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protected, updatePassword);
router.patch('/updateMe', protected, updateMe);
router.delete('/deleteMe', protected, deleteMe);
router.get('/me', protected, getMe, getUser);

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