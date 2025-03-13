const mongoose = require('mongoose');

// Creates the schema of our document.
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    }
});

// Creates a model from our schema.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;