const express = require('express');
const fs = require('fs');

const app = express();

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

const port = 8000;
app.listen(port, () => {
    console.log(`Listening on port number: ${port}`);
})