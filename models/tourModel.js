const mongoose = require('mongoose');
const slugify = require('slugify');

// Creates the schema of our document.
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must be less than or equal to 40 characters'],
        minlength: [10, 'A tour name must be greater than or equal to 10 characters']
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
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1.0, 'Rating must be above 1.0'],
        max: [5.0, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (value) {
                // 'this' only points to current document on NEW document creation
                // and not when the document is updated.
                return this.price > value;
            },
            message: 'Discount price ({VALUE}) should be less than the actual price'
        }
    },
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
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    // Defining a field with array of objects creates a new embedded document
    // inside a parent document.
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    // Referencing the User document using IDs.
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property for our schema.
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// Virtual populate
// This will create a virtual field 'reviews' in the Tour model.
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
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

// This will populate the 'guides' field with the actual user data
// wherever a 'find' query is made using the Tour model.
tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });
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