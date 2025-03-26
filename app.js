const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
// All the middlewares in the "Middleware stack" has access to the
// 'req', 'res' and 'next' variable.

if (process.env.NODE_ENV === 'development') {
    // Logger middleware
    app.use(morgan('dev'));
}

// Middleware to send data through requests.
app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toDateString();
    next();
})

// ROUTES
// Router middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Router middleware for all invalid routes.
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;