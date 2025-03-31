const AppError = require('./../utils/appError');

const handleCastErrorDB = errCast => {
    const message = `Invalid ${errCast.path}: ${errCast.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = errDup => {
    const value = errDup.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = errValidation => {
    const errors = Object.values(errValidation.errors).map(errorObj => errorObj.message);

    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token! Please login again.', 401)

const handleJWTExpiredError = () => new AppError('Token has expired! Please login again.', 401)

const sendErrorDev = (errorDev, res) => {
    res.status(errorDev.statusCode).json({
        status: errorDev.status,
        error: errorDev,
        message: errorDev.message,
        stack: errorDev.stack
    });
}

const sendErrorProd = (errorProd, res) => {
    // Operational error, It is trusted and message can be sent to client.
    if (errorProd.isOperational) {
        res.status(errorProd.statusCode).json({
            status: errorProd.status,
            message: errorProd.message
        });
    }
    // Programming or any other unknown error, It cannot be trusted
    // and we don't leak the error details to client.
    else {
        // 1. Log to console.
        // console.error('Error: ', errorProd);

        // Send a generic error message.
        res.status(500).json({
            status: errorProd.status,
            message: 'Something went wrong!'
        });
    }
}

const globalErrorHandler = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let errCopy = { ...err };

        if (errCopy.name === 'CastError') errCopy = handleCastErrorDB(errCopy);
        if (errCopy.code === 11000) errCopy = handleDuplicateFieldsDB(errCopy);
        if (errCopy.name === 'ValidationError') errCopy = handleValidationErrorDB(errCopy);
        if (errCopy.name === 'JsonWebTokenError') errCopy = handleJWTError();
        if (errCopy.name === 'TokenExpiredError') errCopy = handleJWTExpiredError();

        sendErrorProd(errCopy, res);
    }
}

module.exports = globalErrorHandler;