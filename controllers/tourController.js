const Tour = require('./../models/tourModel');

// // Getting 'tours' data from file.
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

const getAlltours = async (req, res) => {
    try {
        // Build query
        // 1) Filtering
        // To create a shallow copy of the original req.query object,
        // we use destructuring.
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(field => delete queryObj[field]);

        // 2) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, matchStr => `$${matchStr}`);
        // console.log(JSON.parse(queryStr));

        // This will return the tours based on our updated query.
        let query = Tour.find(JSON.parse(queryStr));

        // 3) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
        // A default sort based on the field 'createdAt' in descending order.
        else {
            query = query.sort('-createdAt');
        }

        // 4) Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }
        // A default field that we want to exclude.
        else {
            query = query.select('-__v');
        }

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
            message: error
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
    deleteTour
}