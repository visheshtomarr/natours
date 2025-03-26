const mongoose = require('mongoose');
const validator = require('validator');

// Create a user schema for our document.
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowerCase: true,
        validator: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'A user must set a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'A user needs to confirm their password']
    }
});

// Creates a model from our user schema.
const User = mongoose.model('User', userSchema);

module.exports = User;