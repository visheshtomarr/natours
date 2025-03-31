const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
}

// Function to sign up a new user.
const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

// Function to login existing user.
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password exists.
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // Check if user exists and password is correct
    // We need to find the user using the email field and explicitly 
    // select the password field as well.
    const user = await User.findOne({ email }).select('+password');

    // If either the user does not exist or if the entered password
    // does not match with the password in DB, we return error.
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password!', 401));
    }

    // If everything is Ok, send token to client.
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});

module.exports = {
    signup,
    login
}