const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

const filteredObj = (obj, ...allowedFields) => {
    const validObj = {};
    Object.keys(obj).forEach(field => {
        if (allowedFields.includes(field)) validObj[field] = obj[field];
    });
    return validObj;
}

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented!',
    });
}

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented!',
    });
}

const updateMe = catchAsync(async (req, res, next) => {
    // We will return error if user tries to update password field.
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError(
            'This route is not for password updates. Please use /updatePassword to update your password',
            400
        ));
    }

    // Filetered out unwanted fields that shouldn't be updated.
    const filteredBody = filteredObj(req.body, 'name', 'email');

    // Update user details (only name and email).
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

const deleteMe = catchAsync(async (req, res, next) => {
    // We will set the 'active' property to false for the deleted user.
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented!',
    });
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented!',
    });
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe
}