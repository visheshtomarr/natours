const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

// // We don't want to store the image directly to storage.
// // We will store it in memory as buffer and resize it first. 
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // First argument is for 'error' and second is for callback function.
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         // Will save the file as "user-userId-currentTimestamp"
//         const extension = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//     }
// });

// This will store the image as 'buffer' in memory.
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image!. Please upload images only.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});
const uploadUserPhoto = upload.single('photo');

const resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    // Use sharp to resize and save the file to our destination.
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
})

const filteredObj = (obj, ...allowedFields) => {
    const validObj = {};
    Object.keys(obj).forEach(field => {
        if (allowedFields.includes(field)) validObj[field] = obj[field];
    });
    return validObj;
}

const getAllUsers = getAll(User);
const getUser = getOne(User);
// Passwords can't be updated with this!
const updateUser = updateOne(User);
const deleteUser = deleteOne(User);

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented! Use /signup instead.',
    });
}

// Middleware to set 'id' as params to get logged in user.
const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
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
    if (req.file) filteredBody.photo = req.file.filename;

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

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
    getMe,
    uploadUserPhoto,
    resizeUserPhoto
}