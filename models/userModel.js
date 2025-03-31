const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
        required: [true, 'A user needs to confirm their password'],
        validate: {
            // This only works on "SAVE" and "CREATE" and not when a
            // password is updated.
            validator: function (value) {
                return value === this.password;
            },
            message: 'Passwords does not match!'
        }
    }
});

// Hash user's password just before saving it into the database.
userSchema.pre('save', async function (next) {
    // Run this middleware if the only the "password" field is modified.
    if (!this.isModified('password')) return next();

    // Hash the password with the cost parameter of 12.
    this.password = await bcrypt.hash(this.password, 12);

    // Only need this field to validate the entered password. 
    // So we will not store 'passwordConfirm' field in DB.
    this.passwordConfirm = undefined;
    next();
});

// Creates a model from our user schema.
const User = mongoose.model('User', userSchema);

module.exports = User;