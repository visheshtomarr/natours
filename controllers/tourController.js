const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// // Getting 'tours' data from file.
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// A middleware for requesting top 5 cheapest tours.
const aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    // This will sort the tours in descending order of 'ratingsAverage'
    // and ascending order of 'price'.
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,difficulty,price,ratingsAverage,summary';
    next();
}

// To get tour statistics.
const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            // Group by the level of difficulty.
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            // Sort by 'avgPrice' in ascending order. 
            $sort: { avgPrice: 1 }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

// To plan the busiest month of year for tours.
const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = Number(req.params.year);

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
});

const getAlltours = catchAsync(async (req, res, next) => {
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
});

const getTour = catchAsync(async (req, res, next) => {
    // Find tour by id.
    const tour = await Tour.findById(req.params.id);

    // if there is no tour, we send 404 not found response.
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        },
    });
});

const createTour = catchAsync(async (req, res, next) => {
    // .create() method will create and save a new 
    // tour in our database.
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        },
    });
});

const updateTour = catchAsync(async (req, res, next) => {
    // All the find methods on a model are query methods.
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        // returns the object after updation.
        new: true,
        // the validators specified in the schema will run when 
        // document is updated.
        runValidators: true
    });

    // if there is no tour, we send 404 not found response.
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        },
    });
});

const deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    // if there is no tour, we send 404 not found response.
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    // Status '204' means no content, so we send 'null'. 
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

module.exports = {
    getAlltours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan
}