const { promisify } = require('util');
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

// Middleware function to create protected routes.
const protected = catchAsync(async (req, res, next) => {
    // Get token if it's present.
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please login to continue!', 401));
    }

    // Verify token
    const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(payload.id);
    if (!currentUser) {
        return next(new AppError('The user bearing this token no longer exists.', 401));
    }

    // Check if user changed password after token is issued
    if (currentUser.changedPasswordAfter(payload.iat)) {
        return next(new AppError('Password has been changed recently. Please login again!', 401));
    }

    req.user = currentUser;
    next();
});

// Middleware function to restrict certain functionality.
const restrictedTo = (...roles) => {
    return (req, res, next) => {
        // 'roles' array should only contain either 'admin' or 'lead-guide' roles.
        // We get the current user's role from the previous middleware that runs just before this one.
        // If the current user's role is any other than 'admin' or 'lead-guide', further action cannot
        // be performed.
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You are not authorized to perform this action', 403));
        }

        next();
    };
}


module.exports = {
    signup,
    login,
    protected,
    restrictedTo
}