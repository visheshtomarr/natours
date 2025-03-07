const express = require('express');

const app = express();

// Creating a 'get' request.
app.get('/', (req, res) => {
    res
        .status(200)
        .json({ message: 'Hello from the server', app: 'Natours' });
});

// Creating a 'post' request.
app.post('/', (req, res) => {
    res.send('You can post to this endpoint!');
})

const port = 8000;
app.listen(port, () => {
    console.log(`Listening on port number: ${port}`);
})