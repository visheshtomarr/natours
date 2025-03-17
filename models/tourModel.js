const mongoose = require('mongoose');
const slugify = require('slugify');

// Creates the schema of our document.
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        required: [true, 'A tour must have a description'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property for our schema.
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// Document Middleware
// This middleware only runs before '.save()' and '.create()' method.
// This middleware is also called as pre-save hook.
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// // The post-save hook doesn't have the 'this' keyword,
// // instead it has access to the saved document. 
// tourSchema.post('save', (doc, next) => {
//     console.log(doc);
//     next();
// });

// Query middleware
// This middleware will execute for every query that 
// starts with 'find'.
tourSchema.pre(/^find/, function (next) {
    // 'this' will be a query object in this middlware.
    this.find({ secretTour: { $ne: 'true' } });
    next();
});

// Aggregation middleware
// This middleware can be used to edit the aggregation pipeline
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    console.log(this.pipeline());
    next();
});

// Creates a model from our schema.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;