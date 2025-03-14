const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

// // Getting 'tours' data from file.
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// A middleware for requesting top 5 cheapest tours.
const aliasTopTours = async (req, res, next) => {
    req.query.limit = '5';
    // This will sort the tours in descending order of 'ratingsAverage'
    // and ascending order of 'price'.
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,difficulty,price,ratingsAverage,summary';
    next();
}

const getAlltours = async (req, res) => {
    try {
        // Build query
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const query = features.query;

        // Build tours
        const tours = await query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
}

const getTour = async (req, res) => {
    try {
        // Find tour by id.
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}

const createTour = async (req, res) => {
    try {
        // .create() method will create and save a new 
        // tour in our database.
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })
    }
}

const updateTour = async (req, res) => {
    try {
        // All the find methods on a model are query methods.
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            // returns the object after updation.
            new: true,
            // the validators specified in the schema will run when 
            // document is updated.
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
}

const deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        // Status '204' means no content, so we send 'null'. 
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
}

module.exports = {
    getAlltours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours
}