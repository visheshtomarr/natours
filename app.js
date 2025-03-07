const express = require('express');
const fs = require('fs');

const app = express();

// Middleware to send data through requests.
app.use(express.json());

// // Creating a 'get' request.
// app.get('/', (req, res) => {
//     res
//         .status(200)
//         .json({ message: 'Hello from the server', app: 'Natours' });
// });

// // Creating a 'post' request.
// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint!');
// })

// Getting 'tours' data from file.
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Creating 'get' api for getting all tours.
app.get('/api/v1/tours', (req, res) => {
    res
        .status(200)
        .json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            },
        });
});

// Creating a 'post' request to create a new tour.
app.post('/api/v1/tours', (req, res) => {
    // console.log(req.body);

    // Create a new id for a new tour.
    const newId = tours[tours.length - 1].id + 1;
    // Create a new tour.
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    // Write the new tour inside the data file.
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res
            .status(201)
            .json({
                status: 'success',
                data: {
                    tour: newTour
                },
            })
    });
});

const port = 8000;
app.listen(port, () => {
    console.log(`Listening on port number: ${port}`);
})