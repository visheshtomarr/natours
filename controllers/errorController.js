const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    // Operational error, It is trusted and message can be sent to client.
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    // Programming or any other unknown error, It cannot be trusted
    // and we don't leak the error details to client.
    else {
        // 1. Log to console.
        console.error('Error: ', err);

        // Send a generic error message.
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
}

module.exports = (err, req, res, next) => {
    console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    }
}