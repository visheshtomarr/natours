const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Read the environment variable file.
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD);

// Returns a promise.
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successful!'));

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

// Instance of our 'Tour' model.
const testTour = new Tour({
    name: 'The Forest Hiker',
    rating: 4.7,
    price: 499
});

// Save the testTour to our database.
testTour
    .save()
    .then(doc => console.log(doc))
    .catch(err => console.log(err));

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port number: ${port}`);
})