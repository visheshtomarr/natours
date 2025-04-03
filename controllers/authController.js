const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
}

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token
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
    createAndSendToken(user, 200, res);
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

const forgotPassword = catchAsync(async (req, res, next) => {
    // Get user based on email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('No user found with this email address!', 404));
    }

    // Generate the random reset token for the user.
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send it to user's email.
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? You can use the link to reset your password: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return new AppError('There was an error sending the email. Please try again!', 500);
    }
});

const resetPassword = catchAsync(async (req, res, next) => {
    // Get the user based on the token
    // Token saved in db is encrypted, so we will hash the token present in request.
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // This will find the user whose token matches the hashed token from the request and
    // that the token is yet to expire.
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        // This will ensure whether the 'passwordResetExpires' field is greater than current date/time.
        passwordResetExpires: { $gt: Date.now() }
    })

    // If there is user and the token is not expired, we set the new password
    if (!user) {
        return next(new AppError('Token is invalid or expired!', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Change the 'changePasswordAt' property of user.

    // Login the user, send jwt.
    createAndSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
    // Get user from the collection.
    const user = await User.findById(req.user.id).select('+password');

    // Check if the password posted is correct.
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Please enter correct password!', 401));
    }

    // Update the password.
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Login the user, send jwt.
    createAndSendToken(user, 200, res);
});

module.exports = {
    signup,
    login,
    protected,
    restrictedTo,
    forgotPassword,
    resetPassword,
    updatePassword
}