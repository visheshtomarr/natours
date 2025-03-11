const fs = require('fs');

// Getting 'tours' data from file.
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// A param middleware.
// This middleware will check whether the 'id' entered is correct or not.
const checkId = (req, res, next, value) => {
    console.log(`Tour id: ${value}`);

    if (Number(req.params.id) > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }
    next();
}

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
        results: tours.length,
        data: {
            tours
        },
    });
}

const getTour = (req, res) => {
    // console.log(req.params);
    // Convert the value of id from the params to a number type.
    const id = Number(req.params.id);

    // Find the tour corresponding to the id.
    const tour = tours.find(tour => tour.id === id);

    // If no tour with the provided id is found, we return "404 not found".
    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID",
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        },
    });
}

const createTour = (req, res) => {
    // console.log(req.body);

    // Create a new id for a new tour.
    const newId = tours[tours.length - 1].id + 1;
    // Create a new tour.
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    // Write the new tour inside the data file.
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            },
        })
    });
}

const updateTour = (req, res) => {
    if (Number(req.params.id) > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

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
    checkId,
    checkBody
}