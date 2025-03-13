const Tour = require('./../models/tourModel');

// // Getting 'tours' data from file.
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

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
    deleteTour
}