const Tour = require('./../models/tourModel');

// // Getting 'tours' data from file.
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// A middleware to check if body contains the name and price property.
const checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        // return a response of "bad request".
        return res.status(400).json({
            status: 'fail',
            message: 'name or price property undefined!',
        });
    }
    next();
}

const getAlltours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        // results: tours.length,
        // data: {
        //     tours
        // },
    });
}

const getTour = (req, res) => {
    // console.log(req.params);
    // Convert the value of id from the params to a number type.
    const id = Number(req.params.id);

    // // Find the tour corresponding to the id.
    // const tour = tours.find(tour => tour.id === id);

    // // If no tour with the provided id is found, we return "404 not found".
    // if (!tour) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: "Invalid ID",
    //     });
    // }

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     },
    // });
}

const createTour = (req, res) => {
    res.status(201).json({
        status: 'success',
        // data: {
        //     tour: newTour
        // },
    });
}

const updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Updated tour',
    });
}

const deleteTour = (req, res) => {
    // Status '204' means no content, so we send 'null'. 
    res.status(204).json({
        status: 'success',
        data: null,
    });
}

module.exports = {
    getAlltours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    checkBody
}