const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const morgan = require('morgan');

const app = express();

// MIDDLEWARES
// All the middlewares in the "Middleware stack" has access to the
// 'req', 'res' and 'next' variable.
// Middleware to send data through requests.
app.use(express.json());

// Logger middleware
app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log('Hello from the middleware!');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toDateString();
    next();
})

// ROUTES
// Router middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;