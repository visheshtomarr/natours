const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A user must set a password'],
        minlength: 8,
        select: false
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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
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

// Change the 'changePasswordAt' property of the user just before saving the new
// password in the database.
userSchema.pre('save', function (next) {
    // If the password hasn't been modified or if the document is newly created,
    // (which means the password will be modified) we return from the function.
    if (!this.isModified('password') || this.isNew) return next();

    // We want to save this field before issuing the token to user
    // so that the token remains valid.
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// Query middleware to check for active users.
userSchema.pre(/^find/, function (next) {
    // This will run before every query that starts with 'find' and
    // look for the users that doesn't have 'active' property set to false.
    this.find({ active: { $ne: false } });
    next()
})

// Instance method on our user schema to compare passwords.
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

// Instance method to check if user changed password.
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // console.log(passwordChangedTimestamp, JWTTimestamp);

        return JWTTimestamp < passwordChangedTimestamp;
    }

    return false;
}

// Instance method to generate password reset token.
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Store the sha256 encrypted version of resetToken in the database.
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Reset token will expire after 10 mins of issue.
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

// Creates a model from our user schema.
const User = mongoose.model('User', userSchema);

module.exports = User;