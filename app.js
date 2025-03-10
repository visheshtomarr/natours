const express = require('express');
const fs = require('fs');

const app = express();

// Middleware to send data through requests.
app.use(express.json());

// Getting 'tours' data from file.
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAlltours = (req, res) => {
    res.status(200).json({
        status: 'success',
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
        res.status(404).json({
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
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
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
        res.status(404).json({
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
    if (Number(req.params.id) > tours.length) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    // Status '204' means no content, so we send 'null'. 
    res.status(204).json({
        status: 'success',
        data: null,
    });
}

// // Creating 'get' api for getting all tours.
// app.get('/api/v1/tours', getAlltours);

// // Creating a 'get' api to get a single tour by id.
// // Using ":" creates a new parameter variable for us. 
// app.get('/api/v1/tours/:id', getTour);

// // Creating a 'post' api to create a new tour.
// app.post('/api/v1/tours', createTour);

// // Creating a 'patch' api to update an existing tour.
// app.patch('/api/v1/tours/:id', updateTour);

// // Creating a 'delete' api to delete an existing tour.
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAlltours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

const port = 8000;
app.listen(port, () => {
    console.log(`Listening on port number: ${port}`);
})